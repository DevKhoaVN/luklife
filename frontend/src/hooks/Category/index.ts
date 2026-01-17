import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "../../api/category.api";

export const useGetCategories = () => {
  return useQuery({
    queryKey: ['admin-orders-data'],
    queryFn: getAllCategories,
    staleTime: 5 * 60 * 1000,     
    gcTime: 10 * 60 * 1000,       
    retry: 2,
  });
};