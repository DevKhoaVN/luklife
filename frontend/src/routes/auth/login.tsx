import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import React, { useContext, useState } from "react";

import { useAuth } from "../../hooks/useAuth";
import AppContext from "../../context/AppContext";

export const Route = createFileRoute("/auth/login")({
  component: LoginForm,
});

function LoginForm() {
  const { loginAsync, isLoginLoading, loginError } = useAuth();
  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();

  // State password
  const [showPassword, setShowPassword] = useState(false);

  // Function xem password
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const result = await loginAsync(data);

      setUser(result.user);

      navigate({ to: "/" });
    } catch (err) {
      console.error("Login thất bại:", err);
    }
  };

  return (
    <div className="flex justify-center items-start pt-16 min-h-screen w-full bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 shadow-xl rounded-lg">
        <header className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Đăng nhập</h2>
          <p className="text-sm text-gray-500 mt-1">
            Đăng nhập và Tận hưởng ưu đãi Thành viên
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Trường Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Email <span className="text-red-600">*</span>
            </label>
            <input
              id="email"
              type="text"
              {...register("email", {
                required: "Email là bắt buộc.",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Email không đúng định dạng.",
                },
              })}
              className="w-full p-2 bg-gray-50 border rounded-md border-gray-300 text-sm outline-none transition duration-150 ring-0 ring-red-500 focus:ring-red-500 focus:border-red-500"
              placeholder="Nhập email"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Trường Mật khẩu */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Mật khẩu <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Mật khẩu là bắt buộc.",
                  minLength: {
                    value: 6,
                    message: "Mật khẩu phải có ít nhất 6 ký tự.",
                  },
                })}
                className="w-full p-2 bg-gray-50 border rounded-md border-gray-300 text-sm outline-none transition duration-150 ring-0 ring-red-500 focus:ring-red-500 focus:border-red-500"
                placeholder="Nhập mật khẩu"
              />
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Hành động phụ */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                {...register("remember")}
                className="h-4 w-4 text-red-600 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 text-gray-700">
                Giữ trạng thái đăng nhập
              </label>
            </div>
            <Link
              to="/"
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Quên mật khẩu?
            </Link>
          </div>

          {/* Hiển thị lỗi từ API */}
          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">
                {loginError?.message || "Đăng nhập thất bại. Vui lòng thử lại."}
              </p>
            </div>
          )}

          {/* Nút Đăng nhập */}
          <button
            type="submit"
            disabled={isSubmitting || isLoginLoading}
            className="w-full py-3 mt-6 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition duration-200 disabled:bg-red-300 disabled:cursor-not-allowed"
          >
            {isSubmitting || isLoginLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {/* Link chuyển sang Đăng ký */}
        <p className="text-center text-sm mt-4 text-gray-600">
          Chưa có tài khoản?
          <Link
            to="/auth/register"
            className="text-red-600 hover:text-red-700 font-bold ml-1"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
