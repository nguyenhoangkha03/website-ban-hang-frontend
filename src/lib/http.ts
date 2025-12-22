import axios from 'axios';

// Lấy URL từ biến môi trường (tạo file .env.local nếu chưa có)
// NEXT_PUBLIC_API_URL=http://localhost:5000/api
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const http = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Tự động gắn Token vào Request
http.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage (hoặc từ Zustand store nếu muốn)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('ACCESS_TOKEN');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Xử lý Response (VD: Token hết hạn thì logout)
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logic logout hoặc refresh token ở đây
      // Tạm thời xóa token và redirect
      if (typeof window !== 'undefined') {
        // localStorage.removeItem('ACCESS_TOKEN');
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);