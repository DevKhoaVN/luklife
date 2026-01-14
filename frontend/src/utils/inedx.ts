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
