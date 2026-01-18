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

export const getAddresses = async () => {
  const response = await apiClient.get(`/user/address`) ;
  return response.data;
}
export const createAdddress = async (data : {
  full_name: string;
  phone: string;
  address_line: string;
  province: string;
  district: string;
  ward: string;
  is_default: boolean;
}) => {
  const response = await apiClient.post(`/user/address`, {
    recipient_name: data.full_name,
    recipient_phone: data.phone,
    address_line1: data.address_line,
    city: data.province,
    district: data.district,
    ward: data.ward,
    is_default: data.is_default,
  }
  );
  return response.data;
}

export const setIsDefaultAddress = async (addressId: number) => {
  const response = await apiClient.patch(`/user/address/${addressId}/set-default`);
  return response.data;
}

export const updateAddress = async (addressId: number, data: {
  full_name?: string;
  phone?: string;
  address_line?: string;
  province?: string;
  district?: string;
  ward?: string;
  is_default?: boolean;
} ) => {
  const response = await apiClient.patch(`/user/address/${addressId}`, data);
  return response.data;
}

export const deleteAddress = async (addressId: number) => {
  const response = await apiClient.delete(`/user/address/${addressId}`);
  return response.data;
}
export const resetPassword = async (
  current_password: string, new_password: string
) => {
  const response = await apiClient.post(`/user/reset-password`, { current_password, new_password });
  return response.data;
};
export const getAllUsers = async () => {
  const response = await apiClient.get(`user`);
 return response.data;
}
export const deleteUser = async (userId: number) => {
  const response = await apiClient.delete(`user/${userId}`);
  return response.data;
}
export const updatePasswordUserByAdmin = async (userId: number, newPassword: string) => {
    const response = await apiClient.put(`/user/${userId}`, { password: newPassword });
    return response.data;

}