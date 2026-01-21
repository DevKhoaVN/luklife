// src/hooks/useProducts.ts
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getWhiteListProduct,
  getOnlineExclusiveOffer,
  getSaleProduct,
  getProductsByCategory,
  getProductBySlug,
  getAllProducts,
  type Product,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
} from '../api/product.api';
import { toast } from 'react-toastify';


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

export const useGetAllProducts = ({ page = 1, search = '' }: { page?: number; search?: string }) => {
  return useQuery({
    queryKey: ['allProducts', page, search],
    queryFn: () => getAllProducts({ page, search }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Product) => createProduct(data),
    onSuccess: () => {
      // Làm mới danh sách sản phẩm sau khi tạo thành công
      toast.success('Tạo sản phẩm thành công');
      queryClient.invalidateQueries({ queryKey: ['allProducts'] });
    },
  });
};

export const useUpdateProduct = () => {
   const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Product) => updateProduct (data),
    onSuccess: () => {
      // Làm mới danh sách sản phẩm sau khi tạo thành công
      toast.success('Cập nhật sản phẩm thành công');
      queryClient.invalidateQueries({ queryKey: ['allProducts'] });
    },
  });
}

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProduct (id),
    onSuccess: () => {
      // Làm mới danh sách sản phẩm sau khi tạo thành công
      toast.success('Xóa sản phẩm thành công');
      queryClient.invalidateQueries({ queryKey: ['allProducts'] });
    },
  });
}

export const useSearchProduct = (searchKey: string | undefined, page: number = 1) => {
  return useQuery({
    // QueryKey quan trọng để React Query biết khi nào cần fetch lại data
    queryKey: ['products', searchKey, page], 
    
    // Gọi hàm API của bạn
    queryFn: () => searchProduct(searchKey, page),

    // Option: Chỉ fetch khi searchKey có giá trị (tránh gọi API rỗng khi vừa vào trang)
    enabled: !!searchKey, 

    // Option: Giữ lại dữ liệu cũ trong khi fetch dữ liệu mới (giúp UI không bị giật lag)
    placeholderData: (previousData) => previousData,

    // Tự động fetch lại sau khi người dùng ngừng gõ (Debounce) thường xử lý ở phía UI
    staleTime: 5000, // Dữ liệu được coi là mới trong 5 giây
  });
};