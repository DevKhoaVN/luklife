import apiClient from "./axios"

//login function
export const getStatic = async () => {
    const response = await apiClient.get(`/admin/static`)
    return response.data;
}

export const getAllOrders = async() => {
    const response = await apiClient.get(`/orders`)
    return response.data;
}

