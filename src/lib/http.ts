import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// URL API
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Tạo instance chính
export const http = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});


http.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('ACCESS_TOKEN');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Biến cờ để tránh gọi refresh liên tục khi nhiều API lỗi cùng lúc
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

// 2. RESPONSE INTERCEPTOR: Xử lý lỗi 401 & Refresh Token
http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Nếu lỗi 401 (Unauthorized) và chưa từng thử lại request này
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Nếu đang trong quá trình refresh, xếp request này vào hàng đợi
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }
            return http(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('REFRESH_TOKEN');
        if (!refreshToken) throw new Error('No refresh token available');

        // Gọi API Refresh (Dùng axios gốc để tránh lặp interceptor)
        const response = await axios.post(`${baseURL}/accounts/refresh-token`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        // Lưu token mới
        localStorage.setItem('ACCESS_TOKEN', accessToken);
        localStorage.setItem('REFRESH_TOKEN', newRefreshToken);

        // Gắn token mới vào request cũ và chạy lại
        if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        
        // Xử lý hàng đợi các request bị kẹt
        processQueue(null, accessToken);
        
        return http(originalRequest);

      } catch (refreshError) {
        // Nếu refresh thất bại (hết hạn cả 2) -> Logout
        processQueue(refreshError, null);
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('REFRESH_TOKEN');
        window.location.href = '/login'; // Chuyển về trang login
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);