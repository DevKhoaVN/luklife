import axios from "axios";

const Base_URL_Webiste = import.meta.env.VITE_BASE_URL;

export const apiClient = axios.create({
  baseURL: Base_URL_Webiste,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // cookie
});

// Sử dụng Interceptor để can thiệp vào request trước khi nó được gửi đi
apiClient.interceptors.request.use(
  (config) => {
    // Lấy token từ nơi bạn lưu trữ (thông thường là localStorage)
    const token = localStorage.getItem("access_token");

    if (token) {
      // Gắn Bearer token vào Header Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}[] = [];

// Hàm xử lý các request bị tạm dừng
const processQueue = (error: any | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 2. Hàm gọi API Refresh Token (Đã đơn giản hóa)
const refreshTokenRequest = async () => {
  // Axios sẽ TỰ ĐỘNG gửi Cookie (chứa Refresh Token)
  // vì chúng ta đã bật `withCredentials: true`

  // Request này chỉ cần là một POST đơn giản tới endpoint Refresh Token.
  // Không cần gửi Refresh Token trong body.
  const response = await axios.post(`${Base_URL}/auth/refresh-token`, {});

  // Giả định backend trả về Access Token MỚI trong body.
  const { accessToken: newAccessToken } = response.data;

  // LƯU Ý: Nếu backend cũng cấp Refresh Token mới (Rotating Refresh Token)
  // thì nó phải được đặt trong một HTTP-only Cookie MỚI.
  // Việc này do server thực hiện, Front-end chỉ cần đọc Access Token.

  if (!newAccessToken) {
    throw new Error("Did not receive a new access token");
  }

  // Lưu Access Token MỚI vào Local Storage
  localStorage.setItem("accessToken", newAccessToken);

  return newAccessToken;
};

// 3. Interceptor cho Request (Đính kèm Access Token)
apiClient.interceptors.request.use(
  (config) => {
    // Lấy Access Token từ Local Storage
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 4. Interceptor cho Response (Xử lý Refresh Token)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Kiểm tra lỗi 401 và không phải là request refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // ... (Logic xếp hàng giữ nguyên)
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshTokenRequest(); // Gọi hàm refresh

        processQueue(null, newAccessToken);
        originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        // Buộc người dùng đăng xuất và xóa Access Token
        localStorage.removeItem("accessToken");

        // Không cần xóa Refresh Token vì nó là HTTP-only Cookie,
        // Backend sẽ phải vô hiệu hóa (clear) Cookie đó bằng cách gửi
        // một Set-Cookie header mới khi người dùng logout hoặc refresh thất bại.

        window.location.href = "/auth/login";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
