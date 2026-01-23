import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';

// URL API Backend (Đã bao gồm /api)
// Ví dụ: http://localhost:5000/api
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Tạo instance 'api' dùng chung cho toàn app
export const api = axios.create({
  baseURL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // ✅ BẮT BUỘC: Để gửi/nhận Cookie HttpOnly (RefreshToken)
});

// -----------------------------------------------------------------------------
// 1. REQUEST INTERCEPTOR: Gắn Access Token từ MEMORY (Zustand)
// -----------------------------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    // ✅ Lấy AccessToken từ RAM (Zustand Store) - Không dùng LocalStorage nữa
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
  (response) => response, // Trả về nguyên response nếu thành công
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // ⚠️ QUAN TRỌNG: Bỏ qua các URL Auth để tránh vòng lặp vô tận
    // Cập nhật đúng đường dẫn Backend mới: /cs/accounts/...
    if (
      originalRequest.url?.includes('/cs/accounts/login') ||
      originalRequest.url?.includes('/cs/accounts/refresh-token') ||
      originalRequest.url?.includes('/cs/accounts/social-login') // Thêm cái này để tránh retry khi login lỗi
    ) {
      return Promise.reject(error);
    }

    // Nếu lỗi 401 (Hết hạn Token) và chưa thử lại lần nào
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
        // ✅ Gọi API Refresh Token trực tiếp bằng axios gốc (để không dính interceptor của 'api')
        // Cookie 'c_refresh_token' sẽ tự động được gửi đi nhờ withCredentials: true
        // URL Backend: /api/cs/accounts/refresh-token
        const response = await axios.post(
          `${baseURL}/cs/accounts/refresh-token`,
          {}, // Body rỗng (vì token nằm trong cookie)
          { withCredentials: true }
        );

        // Backend trả về: { success: true, data: { accessToken: "..." } }
        const newAccessToken = response.data?.data?.accessToken;

        if (!newAccessToken) {
          throw new Error("Refresh failed: No access token returned");
        }

        // ✅ Lưu token mới vào Memory (Zustand) -> Update UI ngay lập tức
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
        // Nếu refresh thất bại (Cookie hết hạn hoặc Redis xóa session) -> Logout thật
        processQueue(refreshError, null);
        
        // ✅ Xóa State trong RAM
        useAuthStore.getState().logout();
        
        // Redirect về login (nếu đang không ở trang login)
        if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
           // Dùng window.location để reload sạch sẽ
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