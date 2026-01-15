import apiClient from "./axios";

// Apply discount 
export const applyDiscount = async (data : {code: string , order_value: number}) => {
  const response = await apiClient.post(`/discounts/apply`, {
    code: data.code,
    order_value: data.order_value
  });
  return response.data;
};
