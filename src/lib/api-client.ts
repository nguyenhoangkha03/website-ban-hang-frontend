// import axios, { AxiosError } from 'axios';

// const api = axios.create({
//     baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
//     withCredentials: true,
//     timeout: 10000,
//     headers: {
//       'Content-Type': 'application/json',
//     },
// });

// // Response interceptor for robust error handling
// api.interceptors.response.use(
//   (response) => {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     return response;
//   },
//   (error: AxiosError) => {
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
//         console.error(
//             '\n❌ BACKEND CONNECTION FAILED!\n' +
//             `📍 Could not connect to the server at ${error.config?.baseURL}.\n` +
//             '🚀 Please ensure the backend server is running.\n' +
//             '   cd D:\\code-qlbh-real\\quan-ly-ban-hang-backend-hovtoibranch\n' +
//             '   npm run dev\n'
//         );
//         // Optionally, re-throw a more user-friendly error
//         return Promise.reject(new Error('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.'));
//     }

//     if (error.response) {
//       // The request was made and the server responded with a status code
//       // that falls out of the range of 2xx
//       console.error("API Error Response:", error.response.data);
//       console.error("Status:", error.response.status);
//       console.error("Headers:", error.response.headers);
//     } else if (error.request) {
//       // The request was made but no response was received
//       console.error("API No Response:", error.request);
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       console.error('API Setup Error', error.message);
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;
// api-client.ts (FIXED)
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  withCredentials: true, // ⭐ BẮT BUỘC
  headers: {
    "Content-Type": "application/json",
  },
});

// ❌ KHÔNG gắn Authorization
api.interceptors.request.use((config) => {
  return config;
});

// Handle refresh token
// api.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         await api.post("/accounts/refresh-token");
//         return api(originalRequest); // retry sau khi backend set cookie mới
//       } catch (err) {
//         window.dispatchEvent(new Event("auth-error"));
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: CustomInternalAxiosRequestConfig | undefined = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // refresh token (backend set cookie mới)
        await api.post('/accounts/refresh-token');

        // retry request cũ (cookie đã cập nhật)
        return api(originalRequest);
      } catch (refreshError) {
        // logout
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
