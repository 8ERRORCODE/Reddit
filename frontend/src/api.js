// api.js
import axios from "axios";

// Use environment variable if available, otherwise default to localhost
const backendHost =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const Api = axios.create({
  baseURL: backendHost,
  timeout: 10000,
});

Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem("refresh");
        if (refresh) {
          const res = await axios.post(
            `${backendHost}/api/token/refresh/`,
            { refresh }
          );
          const newAccess = res.data.access;
          localStorage.setItem("access", newAccess);
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return Api(originalRequest);
        }
      } catch (err) {
        console.error("Refresh token failed", err);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default Api;
