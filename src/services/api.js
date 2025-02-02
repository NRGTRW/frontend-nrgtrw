import axios from "axios";
import { getToken } from "../context/tokenUtils"; // ✅ Ensure latest token is used

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
});

// ✅ Add request interceptor for all requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    console.log("📌 Sending Token in Headers:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
