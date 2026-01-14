import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile, getProfile } from "../api/user.api"; 
import { useQuery } from "@tanstack/react-query";

export const useGetProfile = () => {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => updateProfile(data),

    onSuccess: (response) => {
      if (response.success) {
        // Invalidate query để reload profile data [web:8]
        queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        
      }
    },

    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || "Có lỗi xảy ra";
      console.error("Lỗi khi cập nhật profile:", errorMessage);
    }
  });
};