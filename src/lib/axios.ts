import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_URL } from "./constanst";
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  // Cho phép gửi cookies (refreshToken) kèm mỗi request
  withCredentials: true,
});

export default api;
