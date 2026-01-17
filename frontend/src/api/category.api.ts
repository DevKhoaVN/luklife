import apiClient from "./axios";

export const getAllCategories = async () => {
    const response = await apiClient.post(`/category/index`)
    return response.data;
}