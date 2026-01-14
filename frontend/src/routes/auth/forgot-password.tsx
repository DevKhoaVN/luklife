import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Eye, EyeOff, Mail, Lock } from "lucide-react"; // Import icons cần thiết

export const Route = createFileRoute("/auth/forgot-password")({
  component: ResetPasswordForm,
});

// Định nghĩa Route cho trang Quên Mật khẩu (Ví dụ: /auth/forgot-password)

function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // State mô phỏng giai đoạn của quy trình (1: Nhập email, 2: Đặt lại mật khẩu)
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    // Thiết lập mode: 'onChange' để hiển thị lỗi ngay khi gõ
    mode: "onChange",
  });

  const newPasswordValue = watch("newPassword");

  // Hàm tạo lớp CSS cho Input dựa trên trạng thái lỗi
  const getInputClasses = (fieldName) => {
    return `w-full p-2 bg-gray-50 border rounded-md text-sm outline-none transition duration-150 ${
      errors[fieldName]
        ? "border-red-500 ring-2 ring-red-500 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-red-600"
    }`;
  };

  // 1. Xử lý Gửi Email (Step 1)
  const handleRequestReset = async (data) => {
    console.log("Yêu cầu Reset Mật khẩu cho Email:", data.email);
    // Mô phỏng API call để gửi mã OTP
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Nếu thành công, chuyển sang Step 2
    alert(`Mã xác thực 6 chữ số đã được gửi tới ${data.email}.`);
    setStep(2);
  };

  // 2. Xử lý Đặt lại Mật khẩu (Step 2)
  const handleResetPassword = async (data) => {
    console.log("Dữ liệu đặt lại:", data);

    // Mô phỏng API call để xác thực OTP và đặt lại mật khẩu
    await new Promise((resolve) => setTimeout(resolve, 3000));

    alert(
      "Đặt lại mật khẩu thành công! Bạn sẽ được chuyển hướng đến trang Đăng nhập."
    );
    // Sau khi thành công, chuyển hướng người dùng đến trang đăng nhập (Ví dụ: /auth/login)
    // router.navigate({ to: '/auth/login' });
  };

  // Xử lý chung cho form submit
  const onSubmit = (data) => {
    if (step === 1) {
      return handleRequestReset(data);
    } else {
      return handleResetPassword(data);
    }
  };

  return (
    <div className="flex justify-center items-start pt-16 min-h-screen w-full bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 shadow-xl rounded-lg">
        <header className="mb-6 text-center">
          <h2 className="text-xl font-bold text-gray-800">Quên Mật khẩu</h2>
          <p className="text-sm text-gray-500 mt-1">
            {step === 1
              ? "Nhập email của bạn để nhận mã xác thực (OTP)."
              : "Nhập mã xác thực và mật khẩu mới."}
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* GIAI ĐOẠN 1: NHẬP EMAIL */}
          {step === 1 && (
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Email <span className="text-red-600">*</span>
              </label>
              <div className="relative">
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
                  className={getInputClasses("email") + " pl-10"}
                  placeholder="Nhập địa chỉ email"
                />
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          )}

          {/* GIAI ĐOẠN 2: NHẬP OTP VÀ MẬT KHẨU MỚI */}
          {step === 2 && (
            <>
              {/* Trường Mã OTP */}
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Mã xác thực (6 chữ số) <span className="text-red-600">*</span>
                </label>
                <input
                  id="otp"
                  type="text"
                  {...register("otp", {
                    required: "Mã xác thực là bắt buộc.",
                    pattern: {
                      value: /^\d{6}$/, // Yêu cầu chính xác 6 chữ số
                      message: "Mã xác thực phải gồm 6 chữ số.",
                    },
                  })}
                  className={getInputClasses("otp")}
                  placeholder="Nhập mã 6 chữ số từ email"
                  maxLength={6}
                />
                {errors.otp && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.otp.message}
                  </p>
                )}
                <button
                  type="button"
                  className="text-xs text-red-600 hover:text-red-700 mt-1 float-right font-medium"
                  onClick={() => handleRequestReset(getValues())}
                  disabled={isSubmitting}
                >
                  Gửi lại mã
                </button>
              </div>

              {/* Trường Mật khẩu mới */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Mật khẩu mới <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    {...register("newPassword", {
                      required: "Mật khẩu mới là bắt buộc.",
                      minLength: {
                        value: 8,
                        message: "Mật khẩu phải có ít nhất 8 ký tự.",
                      },
                    })}
                    className={getInputClasses("newPassword") + " pr-10 pl-10"}
                    placeholder="Nhập mật khẩu mới"
                  />
                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <span
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>
                {errors.newPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Trường Xác nhận Mật khẩu mới */}
              <div>
                <label
                  htmlFor="confirmNewPassword"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Xác nhận mật khẩu mới <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmNewPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmNewPassword", {
                      required: "Vui lòng xác nhận mật khẩu.",
                      validate: (value) =>
                        value === newPasswordValue ||
                        "Mật khẩu xác nhận không khớp.",
                    })}
                    className={
                      getInputClasses("confirmNewPassword") + " pr-10 pl-10"
                    }
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <span
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 cursor-pointer"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </span>
                </div>
                {errors.confirmNewPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.confirmNewPassword.message}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Nút Xử lý */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-6 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition duration-200 disabled:bg-red-300"
          >
            {isSubmitting
              ? "Đang xử lý..."
              : step === 1
                ? "Gửi Mã Xác thực"
                : "Đặt lại Mật khẩu"}
          </button>
        </form>

        {/* Link quay về Đăng nhập */}
        <p className="text-center text-sm mt-4 text-gray-600">
          Đã nhớ mật khẩu?
          <Link
            to="/auth/login"
            className="text-red-600 hover:text-red-700 font-medium ml-1"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
