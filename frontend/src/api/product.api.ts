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
