// src/hooks/useProducts.ts
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  getWhiteListProduct,
  getOnlineExclusiveOffer,
  getSaleProduct,
  getProductsByCategory,
  getProductBySlug,
} from '../api/product.api';
import { linkOptions } from '@tanstack/react-router';


// Hook cho whitelist products
export const useGetWhiteListProduct = (limit = 10, type = 'whitelist') => {
  return useQuery({
    queryKey: ['whitelistProducts', limit, type],
    queryFn: () => getWhiteListProduct(limit, type),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook cho online exclusive offers
export const useGetOnlineExclusiveOffer = (limit = 10, type = 'deal') => {
  return useQuery({
    queryKey: ['onlineExclusiveOffers', limit, type],
    queryFn: () => getOnlineExclusiveOffer(limit, type),
    staleTime: 5 * 60 * 1000,
  });
};

// Hook cho sale products
export const useGetSaleProduct = (limit = 10, type = 'hot') => {
  return useQuery({
    queryKey: ['saleProducts', limit, type],
    queryFn: () => getSaleProduct(limit, type),
    staleTime: 5 * 60 * 1000,
  });
};

// Hook cho sale products
export const useGetProductDetail = (slug) => {
  return useQuery({
    queryKey: ['saleProducts', slug],
    queryFn: () => getProductBySlug(slug),
    staleTime: 5 * 60 * 1000,
  });
};


// Hook cho product by slug
export const useInfiniteProductsByCategory = ({
  slug,
  limit = 15,
  sort = 'newest',
  priceMax, 
  color,
  child_category
}) => {
  return useInfiniteQuery({
    queryKey: ['infiniteProducts', slug, limit, sort, priceMax, color, child_category],
    queryFn: ({ pageParam = 1 }) =>
      getProductsByCategory({
        slug,
        page: pageParam,
        limit,
        sort,
        priceMax,
        color,
        child_category

      }),
    getNextPageParam: (lastPage) => {
      // Assuming API returns pagination info
      const { pagination } = lastPage;
      return pagination?.hasNextPage ? pagination.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!slug,
  });
};