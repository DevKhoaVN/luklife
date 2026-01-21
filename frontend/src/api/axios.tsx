// src/api/axios.ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Quan trọng: Để gửi cookie refresh token đi kèm
});

// Flag để tránh gọi refresh nhiều lần cùng lúc
let isRefreshing = false;

// Hàng đợi các request bị lỗi 401 chờ refresh token mới
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}> = [];

// Hàm xử lý hàng đợi sau khi refresh xong (thành công hoặc thất bại)
const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// RESPONSE INTERCEPTOR
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Nếu không có originalRequest (lỗi lại network...), reject luôn
    if (!originalRequest) return Promise.reject(error);

    // 1. CHẶN VÒNG LẶP: Nếu lỗi xảy ra ngay tại API refresh hoặc login, không xử lý gì thêm
    if (
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register")
    ) {
      return Promise.reject(error);
    }

    // 2. Xử lý 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang refresh, đẩy request này vào hàng đợi
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            // Khi refresh xong, cập nhật token mới vào header và gọi lại request
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi API Refresh (Dùng axios gốc để tránh interceptor này can thiệp)
        // Cookie sẽ tự động được trình duyệt gửi đi nhờ withCredentials: true
        const response = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const newAccessToken = response.data.token.access_token;

        // Lưu token mới
        localStorage.setItem("token", newAccessToken);
        apiClient.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;

        // Xử lý hàng đợi: Báo cho các request đang chờ biết là đã có token mới
        processQueue(null, newAccessToken);

        // Gọi lại request ban đầu bị lỗi 401
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh thất bại (Cookie hết hạn hoặc không hợp lệ)
        processQueue(refreshError, null);

        // Xóa token rác
        localStorage.removeItem("access_token");

        // Redirect về login
        window.location.href = "/auth/login";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// REQUEST INTERCEPTOR (Giữ nguyên như của bạn là ổn)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default apiClient;
