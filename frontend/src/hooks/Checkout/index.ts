import { type  CheckoutData } from './../../api/checkout.api';
import { useMutation } from "@tanstack/react-query";
import { checkout } from "../../api/checkout.api";

export const useApplyDiscount = () => {

  return useMutation({
    mutationFn: (data: CheckoutData ) => checkout(data),

    onSuccess: (response) => {
      if (response.success) {
        // Invalidate query để reload profile data [web:8]
        console.log(`checkout đơn hàng thành công`)
        
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || "Có lỗi xảy ra";
      console.error("Lỗi khi thực hiện checkout", errorMessage);
    }
  });
};