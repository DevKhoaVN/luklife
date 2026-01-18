
import apiClient from "./axios"


//login function
export const getStatic = async () => {
    const response = await apiClient.get(`/admin/static`)
    return response.data;
}

export const getAllOrders = async ({ page = 1, status = 'all' }: { page?: number; status?: string }) => {
  const params = new URLSearchParams();
  if (status && status !== 'all') params.append('status', status);
  if (page > 1) params.append('page', page.toString());

  const response = await apiClient.get(`/orders?${params.toString()}`);
 
  return response.data; // { data: [...], pagination: {...} }
};

export const getOrderDetailByCode = async(id: string) => {
    const response = await apiClient.get(`/orders/${id}`)
    return response.data;
}

export const updateOrderStatus = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}) => {
  const response = await apiClient.put(`/orders/${id}`, { order_status: status });
  // Hoặc nếu backend dùng PUT: apiClient.put(`/orders/${id}`, { order_status: status });
  return response.data; // giả sử backend trả { success: true, data: updatedOrder, message: "..." }
};
