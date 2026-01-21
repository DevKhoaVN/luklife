import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login, register, logout } from "../api/auth.api";

export const useAuth = () => {
    const queryClient = useQueryClient();

    // Mutation cho login
    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            // Invalidate và refetch các queries liên quan đến user
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: (error) => {
            console.error('Login failed:', error);
        }
    });

    // Mutation cho register
    const registerMutation = useMutation({
        mutationFn: register,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: (error) => {
            console.error('Registration failed:', error);
        }
    });

    // Mutation cho logout
    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            // Xóa accessToken khỏi localStorage
            localStorage.removeItem('accessToken');
            // Clear tất cả queries trong cache
            queryClient.clear();
        },
        onError: (error) => {
            console.error('Logout failed:', error);
        }
    });

    return {
        // Login
        login: loginMutation.mutate,
        loginAsync: loginMutation.mutateAsync,
        isLoginLoading: loginMutation.isPending,
        loginError: loginMutation.error,
        
        // Register
        register: registerMutation.mutate,
        registerAsync: registerMutation.mutateAsync,
        isRegisterLoading: registerMutation.isPending,
        registerError: registerMutation.error,
        
        // Logout
        logout: logoutMutation.mutate,
        logoutAsync: logoutMutation.mutateAsync,
        isLogoutLoading: logoutMutation.isPending,
        logoutError: logoutMutation.error,
    };
};
