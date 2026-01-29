import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';

// URL API Backend
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Tạo instance 'api' dùng chung cho toàn app
export const api = axios.create({
  baseURL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // ✅ BẮT BUỘC: Để gửi/nhận Cookie HttpOnly
});

// -----------------------------------------------------------------------------
// 1. REQUEST INTERCEPTOR: Gắn Access Token từ MEMORY
// -----------------------------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -----------------------------------------------------------------------------
// LOGIC HÀNG ĐỢI (QUEUE)
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
// 2. RESPONSE INTERCEPTOR
// -----------------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // ⚠️ QUAN TRỌNG: CẬP NHẬT ĐƯỜNG DẪN MỚI
    // Tránh vòng lặp vô tận với các API Auth mới
    if (
      originalRequest.url?.includes('/cs/auth/login-zalo') ||     // ✅ Sửa
      originalRequest.url?.includes('/cs/auth/social-login') ||   // ✅ Sửa
      originalRequest.url?.includes('/cs/auth/refresh-token') ||  // ✅ Sửa
      originalRequest.url?.includes('/cs/auth/logout')            // ✅ Thêm
    ) {
      return Promise.reject(error);
    }

    // Nếu lỗi 401 (Hết hạn Token)
    if (error.response?.status === 401 && !originalRequest._retry) {
      
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
        // ✅ CẬP NHẬT API REFRESH TOKEN MỚI
        // URL: /api/cs/auth/refresh-token
        const response = await axios.post(
          `${baseURL}/cs/auth/refresh-token`,
          {}, 
          { withCredentials: true } // Gửi kèm cookie 'c_refresh_token'
        );

        const newAccessToken = response.data?.data?.accessToken;

        if (!newAccessToken) {
          throw new Error("Refresh failed: No access token returned");
        }

        // Cập nhật Store
        useAuthStore.getState().setAccessToken(newAccessToken);

        // Gắn token mới và gọi lại request cũ
        if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        }
        
        processQueue(null, newAccessToken);
        
        return api(originalRequest);

      } catch (refreshError) {
        // Refresh thất bại -> Logout
        processQueue(refreshError, null);
        
        useAuthStore.getState().logout();
        
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