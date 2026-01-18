import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { updateProfile, getProfile, getAddresses, createAdddress, updateAddress, setIsDefaultAddress, resetPassword, deleteAddress, deleteUser, getAllUsers, updatePasswordUserByAdmin } from "../api/user.api"; 

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

export const useGetAddresses = () => {
  return useQuery({
    queryKey: ["user-addresses"],
    queryFn: getAddresses,
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      full_name: string;
      phone: string;
      address_line: string;
      province: string;
      district: string;
      ward: string;
      is_default: boolean;
    }) => createAdddress(data),

    onSuccess: (response) => {
      console.log("✅ Create address success:", response);
      
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
      }
    },

    onError: (error: any) => {
      console.error("❌ Create address error:", error.response?.data || error.message);
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      addressId,
      data,
    }: {
      addressId: number;
      data: {
        full_name?: string;
        phone?: string;
        address_line?: string;
        province?: string;
        district?: string;
        ward?: string;
        is_default?: boolean;
      };
    }) => updateAddress(addressId, data),

    onSuccess: (response) => {
      console.log("✅ Update address success:", response);
      
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
      }
    },

    onError: (error: any) => {
      console.error("❌ Update address error:", error.response?.data || error.message);
    },
  });
};
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: number) => deleteAddress(addressId),

    onSuccess: (response) => {
      console.log("✅ Delete address success:", response);
      
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
      }
    },

    onError: (error: any) => {
      console.error("❌ Delete address error:", error.response?.data || error.message);
    },
  });
};
export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: number) => setIsDefaultAddress(addressId),

    onSuccess: (response) => {
      console.log("✅ Set default address success:", response);
      
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
      }
    },

    onError: (error: any) => {
      console.error("❌ Set default address error:", error.response?.data || error.message);
    },
  });
}
export const useResetPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => resetPassword(currentPassword, newPassword),
    onSuccess: (response) => {
      console.log("✅ Reset password success:", response);
      
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
      }
    },

    onError: (error: any) => {
      console.error("❌ Reset password error:", error.response?.data || error.message);
    },
  });
}
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => deleteUser(userId),
    onSuccess: (response) => {
      console.log("✅ Delete user success:", response);
      queryClient.invalidateQueries({ queryKey: ['all-users-admin'] });
    },
    onError: (error: any) => {
      console.error("❌ Delete user error:", error.response?.data || error.message);
    }   
});
}

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ['all-users'],  
    queryFn: getAllUsers,
    staleTime: 5 * 60 * 1000,
  });
}

export const useUpdatePasswordUser = () => {
return useMutation({
    mutationFn: ({ userId, newPassword }: { userId: number; newPassword: string }) => 
      updatePasswordUserByAdmin(userId, newPassword),
      onSuccess: (response) => {
      console.log("✅ Update password success:", response);
    
    },
    onError: (error) => {
      console.error("❌ Update password error:", error);
    }
  });

}