import apiClient from "./axios";

// Get cart by user ID
export const getProfile = async () => {
  const response = await apiClient.get(`/user/profile`, {
  });
  return response.data;
};



// Add item to cart
export const updateProfile = async (data: {
  full_name: string | null;
  gender: string | null;
  date_of_birth: string | null;
  phone: string | null;
  avatar: File | string | null;
}) => {

  // 1. Khởi tạo FormData - bắt buộc để gửi File
  const formData = new FormData();

  // 2. Đưa các dữ liệu văn bản vào FormData
  // Sử dụng toán tử ?? "" để đảm bảo không gửi chữ "null" (string) xuống DB
  formData.append("full_name", data.full_name ?? "");
  formData.append("gender", data.gender ?? "");
  formData.append("date_of_birth", data.date_of_birth ?? "");
  formData.append("phone", data.phone ?? "");

  // 3. Xử lý File ảnh
  if (data.avatar instanceof File) {
    formData.append("avatar", data.avatar);
  }

  // 4. MẸO QUAN TRỌNG: Giả lập PUT cho Laravel
  // Vì PHP/Laravel không đọc được file qua phương thức PUT trực tiếp từ FormData
  formData.append("_method", "PUT");

  // 5. Gửi request bằng POST (nhưng Laravel sẽ hiểu là PUT nhờ dòng trên)
  const response = await apiClient.post('user/profile', formData, {
    headers: {
      // Axios sẽ tự động thêm Boundary khi thấy FormData, 
      // nhưng ta ghi đè Content-Type để chắc chắn
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

