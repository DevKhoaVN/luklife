import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applyDiscount, createDiscount, deleteDiscount, getAllDiscounts, type DiscountPayload } from "../../api/discount.api";
export const useApplyDiscount = () => {

  return useMutation({
    mutationFn: (data: { code: string, order_value: number }) => applyDiscount(data),

    onSuccess: (response) => {
      if (response.success) {
        // Invalidate query để reload profile data [web:8]
        console.log(`apply code thành công`)
        
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || "Có lỗi xảy ra";
      console.error("Lỗi khi áp dụng mã giảm giá:", errorMessage);
    }
  });
};

// 1. Hook lấy danh sách Discount
export const useDiscounts = () => {
  return useQuery({
    queryKey: ['discounts'],
    queryFn: getAllDiscounts,
    staleTime: 1000 * 60 * 5, // Data được coi là mới trong 5 phút
  });
};

// 2. Hook tạo Discount mới
export const useCreateDiscounts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DiscountPayload) => createDiscount(data),
    onSuccess: () => {
      // Khi tạo thành công -> Tự động load lại danh sách mới nhất
      queryClient.invalidateQueries({ queryKey:['discounts']});
    },
  });
};


// 3. Hook xóa Discount
export const useDeleteDiscount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idOrCode: string | number) => deleteDiscount(idOrCode),
    onSuccess: () => {
      // Khi xóa thành công -> Tự động load lại danh sách
      queryClient.invalidateQueries({ queryKey:['discounts']});
    },
  });
};
