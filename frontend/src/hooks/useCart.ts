import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCart,
  addToCart,
  updateCartQuantity,
  deleteItemFromCart
} from '../api/cart.api';

// 1. Lấy giỏ hàng (Giữ nguyên useQuery vì cần cache)
export const useGetCart = (userId: number) => {
  return useQuery({
    queryKey: ['cart', userId],
    queryFn: () => getCart(userId),
    staleTime: 5 * 60 * 1000,
    
  });
};

// 2. Thêm vào giỏ hàng (Dùng useMutation)
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { variantId: number; quantity: number; cartId: number; price: number }) => 
      addToCart(data),
    onSuccess: () => {
      // Sau khi thêm thành công, làm mới dữ liệu giỏ hàng
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// 3. Cập nhật số lượng
export const useUpdateCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { variantId: number; quantity: number; cartId: number; price: number }) => 
      updateCartQuantity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// 4. Xóa sản phẩm khỏi giỏ
export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartId, variantId }: { cartId: number; variantId: number }) => deleteItemFromCart(cartId,variantId ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};