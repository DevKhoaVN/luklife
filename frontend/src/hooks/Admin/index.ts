import { getAllOrders } from './../../api/admin.api';
import { useQuery } from '@tanstack/react-query';
import { getStatic } from '../../api/admin.api';

export const useStaticData = () => {
  return useQuery({
    queryKey: ['admin-static-data'],
    queryFn: getStatic,
    staleTime: 5 * 60 * 1000,     
    gcTime: 10 * 60 * 1000,       
    retry: 2,
  });
};
export const useGetAllOrders = () => {
  return useQuery({
    queryKey: ['admin-orders-data'],
    queryFn: getAllOrders,
    staleTime: 5 * 60 * 1000,     
    gcTime: 10 * 60 * 1000,       
    retry: 2,
  });
};