import { ArrowLeft } from 'lucide-react';

// src/api/product.api.ts
import apiClient from "./axios";

// Get whitelist products
export const getWhiteListProduct = async (limit = 10, type = 'whitelist') => {
  const response = await apiClient.get(`/products?type=${type}&limit=${limit}`);
  return response.data;
};

// Get online exclusive offers
export const getOnlineExclusiveOffer = async (limit = 10, type = 'deal') => {
  const response = await apiClient.get(`/products?type=${type}&limit=${limit}`);
  return response.data;
};

// Get sale products
export const getSaleProduct = async (limit = 10, type = 'hot') => {
  const response = await apiClient.get(`/products?type=${type}&limit=${limit}`);
  return response.data;
};

interface ProductQueryParams {
  slug: string;           // Bắt buộc (không có dấu ?)
  page?: number;          // Tùy chọn (có dấu ?)
  limit?: number;         // Tùy chọn
  sort?: string;          // Tùy chọn
  priceMax?: number;      // Tùy chọn
  color?: string;   
  child_category?: string      // Tùy chọn
}

// Get products by category
export const getProductsByCategory = async ({
  slug,
  page = 1,
  limit = 30,
  sort = 'newest',
  priceMax = 0, 
  color,
  child_category
}:ProductQueryParams) => {
   // Clean param code (như đã bàn ở câu trước)
  const queryParams = { category: slug, page, limit, sort, priceMax, color,child_category }
  const cleanParams = Object.fromEntries(
    Object.entries(queryParams).filter(([_, v]) => v !== undefined && v !== null && v !== '')
  );
  const params = new URLSearchParams(cleanParams as any); 
   const response = await apiClient.get(`/products?${params}`);
  return response.data;
};

// Get product by slug
export const getProductBySlug = async (slug) => {
  const response = await apiClient.get(`/products/${slug}`);
  return response.data;
};

export const getAllProducts = async ({ page = 1, search = "" }) => {
  const response = await apiClient.get("/products", {
    params: {
      page,    
      search: search || undefined, 
    },
  });
  return response.data;
};

// admin areas 

export interface ProductVariant {
  image_url: string;
  color: string;
  size: string;
  sale_price: number;
  stock_quantity: number;
  is_active: boolean;
}

export interface Product {
  id?: number | string; 
  thumbnail: string;
  name: string;
  price: number;
  discount_percentage: number;
  description: string;
  is_active: boolean;
  is_featured: boolean;
  category_ids: number[];
  variants: ProductVariant[];
}
export const createProduct = async (productData : Product) => {
  const response = await apiClient.post('/products/create', productData , {
    headers: {
      "Content-Type": "Multipart/Form-Data",
    }
  });
  return response.data;
}

export const updateProduct = async ( productData: Product) => {
  console.log("ID của sản phẩm là:", productData.id); 
  

  
  const response = await apiClient.put(`/products/${productData.get('id')}`, productData, {
    headers: {
      "Content-Type": "Multipart/Form-Data",
    }
});
  return response.data;
}

export const deleteProduct = async (id: number | string) => {
  const response = await apiClient.delete(`/products/${id}`);
  return response.data;
}
export const searchProduct = async (searchKey: string | undefined, page: number = 1 ) => {
  const response = await apiClient.get(`/products?search=${searchKey}&page=${page}`);
  return response.data;
}