import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';

// URL API
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Tạo instance (Đổi tên thành 'api' cho chuẩn)
export const api = axios.create({
  baseURL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // ✅ BẮT BUỘC: Để gửi/nhận Cookie HttpOnly
});

// -----------------------------------------------------------------------------
// 1. REQUEST INTERCEPTOR: Gắn Access Token từ MEMORY (Zustand)
// -----------------------------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    // ✅ Lấy token từ RAM (Zustand Store) thay vì LocalStorage
    const token = useAuthStore.getState().accessToken;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -----------------------------------------------------------------------------
// LOGIC HÀNG ĐỢI (QUEUE) KHI REFRESH TOKEN
// Giúp tránh việc gọi API refresh nhiều lần cùng lúc khi nhiều request 401 xảy ra
// -----------------------------------------------------------------------------
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// -----------------------------------------------------------------------------
// 2. RESPONSE INTERCEPTOR: Xử lý lỗi 401 & Silent Refresh (Dùng Cookie)
// -----------------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response, // Trả về nguyên response
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Bỏ qua các URL liên quan đến auth để tránh vòng lặp vô tận
    if (
      originalRequest.url?.includes('/customer/auth/login') ||
      originalRequest.url?.includes('/customer/auth/refresh-token')
    ) {
      return Promise.reject(error);
    }

    // Nếu lỗi 401 và chưa thử lại
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Nếu đang có request khác refresh, xếp hàng đợi
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // ✅ Gọi API Refresh Token trực tiếp bằng axios gốc (để tránh lặp interceptor của instance 'api')
        // Cookie 'c_refresh_token' sẽ tự động được gửi đi nhờ withCredentials: true
        const response = await axios.post(
          `${baseURL}/customer/auth/refresh-token`,
          {}, // Body rỗng
          { withCredentials: true }
        );

        // Backend trả về: { success: true, data: { accessToken: "..." } }
        const newAccessToken = response.data?.data?.accessToken;

        if (!newAccessToken) {
          throw new Error("Refresh failed: No access token returned");
        }

        // ✅ Lưu token mới vào Memory (Zustand)
        useAuthStore.getState().setAccessToken(newAccessToken);

        // Gắn token mới vào request cũ và gọi lại
        if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        }
        
        // Xử lý hàng đợi các request bị kẹt
        processQueue(null, newAccessToken);
        
        // Gọi lại request ban đầu
        return api(originalRequest);

      } catch (refreshError) {
        // Nếu refresh thất bại (Cookie hết hạn hoặc Redis xóa session) -> Logout
        processQueue(refreshError, null);
        
        // ✅ Logout qua Store (Xóa RAM state)
        useAuthStore.getState().logout();
        
        // Redirect về login (nếu đang không ở trang login)
        if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
           window.location.href = '/login'; 
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);