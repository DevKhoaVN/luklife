import { getAllOrders, getOrderDetailByUser, updateOrderStatus } from './../../api/admin.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getStatic } from '../../api/admin.api';
import { getOrderByCode } from '../../api/checkout.api';
import { toast } from 'react-toastify';

export const useStaticData = () => {
  return useQuery({
    queryKey: ['admin-static-data'],
    queryFn: getStatic,
    staleTime: 5 * 60 * 1000,     
    gcTime: 10 * 60 * 1000,       
    retry: 2,
  });
};
export const useGetAllOrders = ({ page = 1, status = 'all' }: { page?: number; status?: string }) => {
  return useQuery({
    queryKey: ['admin-orders', status, page], // ← QUAN TRỌNG: key thay đổi theo status + page
    queryFn: () => getAllOrders({ page, status }),
    staleTime: 5 * 60 * 1000,   // 5 phút
    gcTime: 10 * 60 * 1000,     // 10 phút
    retry: 2,
  });
};

export const useGetOrderDetailByCode = (orderCode: string | undefined) => {
    return useQuery({
     queryKey: ['order-detail', orderCode],   
    queryFn: () => getOrderByCode(orderCode),
    enabled: !!orderCode,   // ← tốt, ngăn fetch khi orderCode là undefined
    })
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderStatus,

    onSuccess: (responseData, variables) => {
      // variables = { id, status } bạn truyền vào mutate
      toast.success('Cập nhật trạng thái thành công!');

      queryClient.invalidateQueries({
        queryKey: ['admin-orders', variables.status], // hoặc ['admin-orders'] nếu muốn refetch tất cả
      });
  },
onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Cập nhật thất bại');
}})
}

export const useGetOrderDetailByUser = () => {
    return useQuery({
     queryKey: ['order-detail', ],   
    queryFn: () => getOrderDetailByUser()
      })
}