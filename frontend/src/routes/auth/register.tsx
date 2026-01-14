import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useState } from "react"; // Import useState
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react"; // Import EyeOff

export const Route = createFileRoute("/auth/register")({
  component: RegisterForm,
});

// Component Form Đăng Ký
function RegisterForm() {
  // === 1. THÊM STATE ĐỂ QUẢN LÝ ẨN/HIỆN MẬT KHẨU ===
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // ===================================================

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const passwordValue = watch("password");

  const onSubmit = async (data) => {
    console.log("Dữ liệu đăng ký:", data);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    alert(`Đăng ký thành công cho Khách hàng: ${data.name} (SĐT: ${data.sdt})`);
  };

  return (
    // Điều chỉnh className để form luôn nằm giữa layout (nếu nó không được bao bởi Layout ngoài)
    <div className="flex justify-center items-start pt-16 min-h-screen w-full bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 shadow-xl rounded-lg">
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Đăng ký tài khoản mới
          </h2>
          <p className="text-sm text-center text-gray-500 mt-1">
            Vui lòng điền đầy đủ thông tin để tạo tài khoản.
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Trường Họ và Tên */}
          <div>
            <label
              htmlFor="name"
              // === SỬA LABEL: Chỉ viết hoa chữ cái đầu tiên ===
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Họ và tên <span className="text-red-600">*</span>
            </label>
            <input
              id="name"
              type="text"
              {...register("name", {
                required: "Họ và Tên là bắt buộc.",
                minLength: {
                  value: 3,
                  message: "Tên phải có ít nhất 3 ký tự.",
                },
              })}
              className="w-full p-2 bg-gray-50 border rounded-md border-gray-300 text-sm outline-none transition duration-150 ring-0 ring-red-500 focus:ring-red-500 focus:border-red-500"
              placeholder="Nhập họ và tên đầy đủ"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

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

          {/* Trường Số điện thoại */}
          <div>
            <label
              htmlFor="sdt"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Số điện thoại <span className="text-red-600">*</span>
            </label>
            <input
              id="sdt"
              type="text"
              {...register("sdt", {
                required: "Số điện thoại là bắt buộc.",
                pattern: {
                  value: /^[0-9]{10,11}$/,
                  message: "SĐT không hợp lệ (chỉ chấp nhận 10-11 chữ số).",
                },
              })}
              className="w-full p-2 bg-gray-50 border rounded-md border-gray-300 text-sm outline-none transition duration-150 ring-0 ring-red-500 focus:ring-red-500 focus:border-red-500"
              placeholder="Nhập số điện thoại"
            />
            {errors.sdt && (
              <p className="text-xs text-red-500 mt-1">{errors.sdt.message}</p>
            )}
          </div>

          {/* Trường Mật khẩu */}
          <div>
            <label
              htmlFor="password"
              // === SỬA LABEL ===
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Mật khẩu <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                // === GÁN TYPE DỰA TRÊN STATE ===
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
                // === GẮN SỰ KIỆN CLICK ===
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {/* HIỂN THỊ ICON TƯƠNG ỨNG */}
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Trường Xác nhận Mật khẩu */}
          <div>
            <label
              htmlFor="confirmPassword"
              // === SỬA LABEL ===
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Xác nhận mật khẩu <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                // === GÁN TYPE DỰA TRÊN STATE ===
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Vui lòng xác nhận mật khẩu.",
                  validate: (value) =>
                    value === passwordValue || "Mật khẩu xác nhận không khớp.", // Logic so sánh
                })}
                className="w-full p-2 bg-gray-50 border rounded-md border-gray-300 text-sm outline-none transition duration-150 ring-0 ring-red-500 focus:ring-red-500 focus:border-red-500"
                placeholder="Nhập lại mật khẩu"
              />
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 cursor-pointer"
                // === GẮN SỰ KIỆN CLICK ===
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {/* HIỂN THỊ ICON TƯƠNG ỨNG */}
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Nút Đăng ký */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-6 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition duration-200 disabled:bg-red-300"
          >
            {isSubmitting ? "Đang xử lý đăng ký..." : "Đăng ký"}
          </button>

          {/* Link quay về Đăng nhập */}
          <p className="text-center text-sm mt-4 text-gray-600">
            Đã có tài khoản?
            <Link
              to="/auth/login"
              className="text-red-600 hover:text-red-700 font-medium ml-1"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
