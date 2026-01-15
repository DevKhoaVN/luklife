import apiClient from "./axios"

export interface CheckoutData {
    recipient_name: string
    recipient_phone: string
    shipping_address: string
    payment_method: string
    discount_code?: string,
    cart_items: Array<{
     variant_id: number,
     quantity: number,
     unit_price: number
    }>
}
export const checkout = async (checkoutData: CheckoutData) => {
   const response = await apiClient.post('/checkout', checkoutData)
   return response.data
}
// Get order status by txn_ref
export const getOrderByTxnRef = async (txnRef: string) => {
  const response = await apiClient.get('/orders/check-payment', {
    params: { txn_ref: txnRef },
  });
  return response.data;
};

// Get order by order_code
export const getOrderByCode = async (orderCode: string)=> {
  const response = await apiClient.get(`/orders/${orderCode}`);
  return response.data;
};