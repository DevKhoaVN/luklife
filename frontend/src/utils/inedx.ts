// Helper flatten tất cả products
export const getAllProducts = (data) => {
  return data?.pages.flatMap((page) => page.data) ?? [];
};
// src/utils/imageHelper.ts
export const getImageUrl = (path: string | null): string => {
  if (!path) return '';
  
  // Nếu đã là full URL (http/https), return luôn
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Nếu là relative path, thêm base URL
  const baseUrl = import.meta.env.VITE_BASE_URL|| 'http://localhost:8000';
  return `${baseUrl}/storage/${path}`;
};

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

 export  const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }); // Kết quả: "01/06/2026"
};