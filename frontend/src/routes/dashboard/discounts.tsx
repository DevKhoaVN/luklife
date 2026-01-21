import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Trash2, Plus, Tag, Calendar, AlertCircle } from "lucide-react";
// Import hook React Query bạn đã tạo (đảm bảo đường dẫn đúng)
import {
  useDiscounts,
  useCreateDiscounts,
  useDeleteDiscount,
} from "../../hooks/Discounts";
// Import Type nếu cần (hoặc dùng lại type đã có trong component nếu chưa tách file)
import type { DiscountPayload } from "./api/discounts";
import { formatDate, formatPrice } from "../../utils/inedx";
import { toast } from "react-toastify";

export const Route = createFileRoute("/dashboard/discounts")({
  component: RouteComponent,
});

// Bạn có thể dùng lại type DiscountPayload từ file api hoặc giữ type ở đây
type DiscountFormValues = {
  code: string;
  name: string;
  description: string;
  type: "percentage" | "fixed_amount";
  value: number;
  min_order_value: number;
  max_discount_value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
};

function RouteComponent() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  // 1. Lấy danh sách Discount từ Server (React Query)
  const {
    data: response, // Mặc định là mảng rỗng
    isLoading,
    isError,
    error,
  } = useDiscounts();

  const discounts = response?.data?.data;

  // 2. Khởi tạo Mutation
  const createMutation = useCreateDiscounts();
  const deleteMutation = useDeleteDiscount();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }, // Không cần isSubmitting của form nữa, dùng của mutation
  } = useForm<DiscountFormValues>({
    defaultValues: {
      type: "percentage",
      is_active: true,
      min_order_value: 0,
      max_discount_value: 0,
    },
    mode: "onBlur",
  });

  // 3. Xử lý Tạo mới
  const onSubmit: SubmitHandler<DiscountFormValues> = (data) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Đã tạo mã giảm giá thành công!");
        reset();
        setIsFormOpen(false);
      },
      onError: (err: any) => {
        toast.error("Lỗi khi tạo: " + (err.message || "Không xác định"));
      },
    });
  };

  // 4. Xử lý Xóa
  const handleDelete = (code: string) => {
    deleteMutation.mutate(code, {
      onSuccess: () => {
        toast.success("Xóa thành công");
      },
      onError: (err: any) => {
        toast.success("Lỗi xóa: " + (err.message || "Không xác định"));
      },
    });
  };

  // Loading State ban đầu
  if (isLoading)
    return <div className="p-10 text-center">Đang tải dữ liệu...</div>;
  if (isError)
    return (
      <div className="p-10 text-center text-red-500">
        Lỗi: {(error as Error).message}
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý Mã Giảm Giá
          </h1>
          <p className="text-gray-500">
            Danh sách các chương trình khuyến mãi đang triển khai
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          {isFormOpen ? (
            "Đóng "
          ) : (
            <>
              <Plus size={20} /> Tạo mã khuyến mãi
            </>
          )}
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-in slide-in-from-top-4 duration-300">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Tag className="text-red-600" size={20} />
            Thông tin khuyến mãi
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cột trái */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã giảm giá (Code)
                  </label>
                  <input
                    {...register("code", {
                      required: "Mã giảm giá là bắt buộc",
                      minLength: {
                        value: 3,
                        message: "Mã phải có ít nhất 3 ký tự",
                      },
                      pattern: {
                        value: /^[A-Z0-9]+$/,
                        message: "Mã chỉ chứa chữ hoa và số",
                      },
                      onChange: (e) => {
                        e.target.value = e.target.value.toUpperCase();
                      },
                    })}
                    placeholder="VD: SALE2026"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                  />
                  {errors.code && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.code.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên chương trình
                  </label>
                  <input
                    {...register("name", {
                      required: "Vui lòng nhập tên chương trình",
                    })}
                    placeholder="VD: Siêu sale mừng tết"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loại giảm
                    </label>
                    <select
                      {...register("type")}
                      className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="percentage">Phần trăm (%)</option>
                      <option value="fixed_amount">Số tiền cố định</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá trị giảm
                    </label>
                    <input
                      type="number"
                      {...register("value", {
                        required: "Nhập giá trị giảm",
                        min: { value: 1, message: "Phải lớn hơn 0" },
                        validate: (val) => {
                          const type = watch("type");
                          if (type === "percentage" && val > 100)
                            return "Không được quá 100%";
                          return true;
                        },
                      })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    {errors.value && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.value.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Cột phải */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày bắt đầu
                    </label>
                    <input
                      type="date"
                      {...register("start_date", {
                        required: "Chọn ngày bắt đầu",
                      })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    {errors.start_date && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.start_date.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày kết thúc
                    </label>
                    <input
                      type="date"
                      {...register("end_date", {
                        required: "Chọn ngày kết thúc",
                        validate: (val) => {
                          const start = watch("start_date");
                          if (!start) return true;
                          return (
                            new Date(val) > new Date(start) ||
                            "Ngày kết thúc phải sau ngày bắt đầu"
                          );
                        },
                      })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    {errors.end_date && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.end_date.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Đơn tối thiểu
                    </label>
                    <input
                      type="number" // Đổi thành number cho chuẩn
                      {...register("min_order_value", {
                        valueAsNumber: true,
                        min: { value: 0, message: "Không được âm" },
                        validate: (value) =>
                          !isNaN(value) || "Vui lòng chỉ nhập số hợp lệ",
                      })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    {errors.min_order_value && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.min_order_value.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giảm tối đa
                    </label>
                    <input
                      type="number" // Đổi thành number
                      {...register("max_discount_value", {
                        valueAsNumber: true,
                        min: { value: 0, message: "Không được âm" },
                        validate: (value) =>
                          !isNaN(value) || "Vui lòng chỉ nhập số hợp lệ",
                      })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    {errors.max_discount_value && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.max_discount_value.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    {...register("description")}
                    rows={2}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending} // Disable khi đang gọi API
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-sm transition-all flex items-center gap-2 disabled:bg-gray-400"
              >
                {createMutation.isPending
                  ? "Đang xử lý..."
                  : "Triển khai & Lưu"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Danh sách Discount */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">
                  Mã / Tên
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">
                  Chi tiết giảm
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">
                  Thời gian
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm text-center">
                  Trạng thái
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm text-right">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {discounts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle size={32} />
                      <p>Chưa có mã giảm giá nào được triển khai</p>
                    </div>
                  </td>
                </tr>
              ) : (
                discounts.map((discount, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 font-mono bg-gray-100 px-2 py-0.5 rounded w-fit text-sm border border-gray-200">
                          {discount.code}
                        </span>
                        <span className="text-sm text-gray-600 mt-1 font-medium">
                          {discount.name}
                        </span>
                        <span className="text-xs text-gray-400 truncate max-w-[200px]">
                          {discount.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 space-y-1">
                        <p className="font-medium text-red-600">
                          Giảm{" "}
                          {discount.type === "percentage"
                            ? `${discount.value}%`
                            : formatPrice(discount.value)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Đơn từ: {formatPrice(discount.min_order_value)}
                        </p>
                        {discount.max_discount_value > 0 && (
                          <p className="text-xs text-gray-500">
                            Tối đa: {formatPrice(discount.max_discount_value)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} className="text-gray-400" />
                        <div className="flex flex-col text-xs">
                          <span>{formatDate(discount.start_date)}</span>
                          <span className="text-gray-400">đến</span>
                          <span>{formatDate(discount.end_date)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          discount.is_active
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        {discount.is_active ? "Hoạt động" : "Tạm dừng"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(discount.id)}
                        disabled={deleteMutation.isPending} // Disable khi đang xóa
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:text-gray-200"
                        title="Xóa triển khai"
                      >
                        {/* Hiện spinner nhỏ nếu đang xóa đúng item này (optional, cần logic phức tạp hơn chút để check đúng id) */}
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
