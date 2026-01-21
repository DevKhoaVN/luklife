import apiClient from "./axios";

// Apply discount 
export const applyDiscount = async (data : {code: string , order_value: number}) => {
  const response = await apiClient.post(`/discounts/apply`, {
    code: data.code,
    order_value: data.order_value
  });
  return response.data;
};


 export type DiscountPayload = {
  code: string;
  name: string;
  description?: string;
  type: "percentage" | "fixed_amount";
  value: number;
  min_order_value: number;
  max_discount_value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
};

export const getAllDiscounts = async() => {
  const response = await apiClient.get("/discounts");
  return response.data;

}
export const createDiscount = async (data: DiscountPayload) => {
  console.log("payload create discount: ", data)
  const response = await apiClient.post("/discounts", 
    data
  )

  return response.data
}

export const deleteDiscount = async (idOrCode: string | number) => {
  const response = await apiClient.delete(`/discounts/${idOrCode}`);

  return response.data;
};