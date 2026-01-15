// src/api/axios.ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
  console.log("🔄 Processing queue:", {
    queueLength: failedQueue.length,
    hasError: !!error,
    hasToken: !!token,
  });

  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

const refreshAccessToken = async (): Promise<string> => {
  console.log("🔄 Starting refresh token process...");

  try {
    // ✅ Kiểm tra cookie có tồn tại không
    console.log("📦 All cookies:", document.cookie);

    const response = await axios.post(
      `${BASE_URL}/auth/refresh`,
      {},
      {
        withCredentials: true,
      }
    );

    console.log("✅ Refresh response:", response.data);

    const newAccessToken = response.data.token.access_token;

    if (!newAccessToken) {
      console.error("❌ No access_token in response:", response.data);
      throw new Error("No access token received");
    }

    localStorage.setItem("access_token", newAccessToken);
    console.log("✅ New access token saved");

    return newAccessToken;
  } catch (error: any) {
    console.error("❌ Refresh token failed:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    localStorage.removeItem("access_token");
    window.location.href = "/auth/login";
    throw error;
  }
};

// REQUEST INTERCEPTOR
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access_token");

    console.log("📤 Request:", {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      token: token ? `${token.substring(0, 20)}...` : "none",
    });

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
apiClient.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", {
      url: response.config.url,
      status: response.status,
    });
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    console.log("❌ Response error:", {
      url: originalRequest?.url,
      status: error.response?.status,
      isRetry: originalRequest?._retry,
      isRefreshing,
      message: error.message,
    });

    // Kiểm tra 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("🔐 Got 401, attempting refresh...");

      // Nếu đang refresh, thêm vào queue
      if (isRefreshing) {
        console.log("⏳ Already refreshing, adding to queue");
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              console.log("✅ Queue: Retrying request with new token");
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(apiClient(originalRequest));
            },
            reject: (err: any) => {
              console.error("❌ Queue: Rejecting request");
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();

        console.log("✅ Refresh successful, processing queue");
        processQueue(null, newAccessToken);

        // Retry original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        console.log("🔄 Retrying original request");
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh failed, rejecting all queued requests");
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        console.log("🔄 Refresh process complete");
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
