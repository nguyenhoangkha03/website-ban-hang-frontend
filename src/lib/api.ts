import axios, { AxiosError } from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
});

// Response interceptor for robust error handling
api.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  (error: AxiosError) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
        console.error(
            '\n❌ BACKEND CONNECTION FAILED!\n' +
            `📍 Could not connect to the server at ${error.config?.baseURL}.\n` +
            '🚀 Please ensure the backend server is running.\n' +
            '   cd D:\\code-qlbh-real\\quan-ly-ban-hang-backend-hovtoibranch\n' +
            '   npm run dev\n'
        );
        // Optionally, re-throw a more user-friendly error
        return Promise.reject(new Error('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.'));
    }

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("API Error Response:", error.response.data);
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("API No Response:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Setup Error', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;