import { useMutation } from "@tanstack/react-query";
import { applyDiscount } from "../../api/discount.api";
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