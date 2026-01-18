
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

// Get products by category
export const getProductsByCategory = async ({
  slug,
  page = 1,
  limit = 30,
  sort = 'newest',
  child_category,
  priceMax = 0, 
  color 
}) => {
  const params = new URLSearchParams({
    category: slug,
    page: page.toString(),
    limit: limit.toString(),
    sort,
    priceMax, 
    color,
    child_category
  })
  const response = await apiClient.get(`/products?${params}`);
  return response.data;
};

// Get product by slug
export const getProductBySlug = async (slug) => {
  const response = await apiClient.get(`/products/${slug}`);
  return response.data;
};

export const getAllProducts = async() => {
  const response = await apiClient.get(`/products`);
  return response.data;
}


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