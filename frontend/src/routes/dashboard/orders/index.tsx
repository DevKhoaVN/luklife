import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useGetAllOrders, useUpdateOrderStatus } from "../../../hooks/Admin";
import React, { useState } from "react";
import {
  Eye,
  Loader2,
  X,
  Info,
  MapPin,
  Calendar,
  ShoppingBag,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";

export const Route = createFileRoute("/dashboard/orders/")({
  validateSearch: (search: Record<string, unknown>) => ({
    status: (search.status as string) || "all",
    page: Number(search.page) || 1,
  }),
  component: OrderPage,
});

export function OrderPage() {
  const navigate = useNavigate();
  const { status = "all", page = 1 } = useSearch({
    from: "/dashboard/orders/",
  });

  console.log("Current search params:", { status, page });

  const { data: ordersResponse, isLoading } = useGetAllOrders({ status, page });
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateOrderStatus();

  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Lấy dữ liệu từ response backend
  const orders = ordersResponse?.data?.data || []; // array đơn hàng
  const pagination = ordersResponse?.data || {
    current_page: page,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0,
  };

  const statusOptions = [
    {
      value: "pending",
      label: "Chờ xử lý",
      color: "bg-orange-50 text-orange-600 border-orange-100",
    },
    {
      value: "confirmed",
      label: "Đã xác nhận",
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      value: "processing",
      label: "Đang xử lý",
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    {
      value: "shipping",
      label: "Đang giao",
      color: "bg-sky-50 text-sky-600 border-sky-100",
    },
    {
      value: "delivered",
      label: "Hoàn thành",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      value: "cancelled",
      label: "Đã hủy",
      color: "bg-red-50 text-red-600 border-red-100",
    },
  ];

  const formatCurrency = (amount: any) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);

  const handleStatusChange = (orderId: string | number, newStatus: string) => {
    updateStatus(
      { id: String(orderId), status: newStatus },
      {
        onSuccess: () => {
          toast.success(`Đã cập nhật trạng thái cho đơn ${orderId}`);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Cập nhật thất bại");
        },
      },
    );
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.last_page) return;
    navigate({
      search: (prev: any) => ({ ...prev, page: newPage }),
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-[#fafafa] min-h-screen text-slate-700">
      {/* Tiêu đề */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Quản lý đơn hàng
        </h1>
        <p className="text-sm text-slate-500">
          Xem và quản lý quy trình vận chuyển
        </p>
      </div>

      {/* Tabs trạng thái */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[{ label: "Tất cả", value: "all" }, ...statusOptions].map((tab) => (
          <button
            key={tab.value}
            onClick={() =>
              navigate({
                search: (prev: any) => ({
                  ...prev,
                  status: tab.value,
                  page: 1, // reset page về 1 khi đổi tab
                }),
              })
            }
            className={`px-5 py-2 text-sm font-medium rounded-full transition-all border ${
              status === tab.value
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bảng đơn hàng */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Mã đơn
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tổng tiền
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.length > 0 ? (
              orders.map((order: any) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {order.order_code}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-700">
                      {order.recipient_name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {order.recipient_phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    {formatCurrency(order.grand_total)}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.order_status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      disabled={isUpdating}
                      className={`text-[12px] font-medium px-3 py-1 rounded-md border outline-none cursor-pointer ${
                        statusOptions.find(
                          (s) => s.value === order.order_status,
                        )?.color || ""
                      }`}
                    >
                      {statusOptions.map((opt) => (
                        <option
                          key={opt.value}
                          value={opt.value}
                          className="bg-white text-slate-700"
                        >
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-slate-400 hover:text-slate-900 transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  Không có đơn hàng nào trong trạng thái này
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {pagination.total > 0 && (
        <div className="flex items-center justify-between px-4 py-4 text-sm text-slate-600 bg-white border-t border-slate-200 rounded-b-xl">
          <div>
            Hiển thị {pagination.from || 0}-{pagination.to || 0} trong tổng{" "}
            {pagination.total} đơn hàng
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page <= 1}
              className="p-2 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="font-medium min-w-[100px] text-center">
              Trang {pagination.current_page} / {pagination.last_page}
            </span>
            <button
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page >= pagination.last_page}
              className="p-2 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-[2px]">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-6 bg-slate-900 rounded-full" />
                <h3 className="font-semibold text-slate-900 text-lg">
                  Chi tiết đơn hàng #{selectedOrder.order_code}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nội dung modal */}
            <div className="p-6 md:p-8 space-y-10">
              {/* 1. Thông tin chung */}
              <section className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-8 border-b border-slate-100">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Mã đơn
                  </p>
                  <p className="text-sm font-semibold">
                    {selectedOrder.order_code}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Ngày đặt
                  </p>
                  <p className="text-sm font-semibold">
                    {new Date(selectedOrder.created_at).toLocaleString("vi-VN")}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Trạng thái
                  </p>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded uppercase bg-blue-50 text-blue-600">
                    {selectedOrder.order_status}
                  </span>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Thanh toán
                  </p>
                  <p className="text-sm font-semibold">
                    {selectedOrder.payment_method.toUpperCase()} (
                    {selectedOrder.payment_status})
                  </p>
                </div>
              </section>

              {/* 2. Thông tin giao nhận */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={18} className="text-slate-900" />
                  <h4 className="text-sm font-bold uppercase tracking-widest">
                    Thông tin giao nhận
                  </h4>
                </div>
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 space-y-4 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase mb-1">
                        Người nhận
                      </p>
                      <p className="font-medium">
                        {selectedOrder.recipient_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase mb-1">
                        Điện thoại
                      </p>
                      <p className="font-medium">
                        {selectedOrder.recipient_phone}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 uppercase mb-1">
                      Địa chỉ đầy đủ
                    </p>
                    <p className="leading-relaxed">
                      {selectedOrder.shipping_address}
                    </p>
                  </div>
                </div>
              </section>

              {/* 4. Tóm tắt thanh toán */}
              <section className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                <h4 className="text-sm font-bold uppercase tracking-widest mb-4">
                  Tóm tắt thanh toán
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Giá trị hàng hóa</span>
                    <span>{formatCurrency(selectedOrder.total_amount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Phí vận chuyển</span>
                    <span>{formatCurrency(selectedOrder.shipping_fee)}</span>
                  </div>
                  {Number(selectedOrder.discount_amount) > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Giảm giá</span>
                      <span>
                        -{formatCurrency(selectedOrder.discount_amount)}
                      </span>
                    </div>
                  )}
                  <div className="pt-4 border-t border-slate-200 flex justify-between font-bold text-base">
                    <span>Tổng thanh toán</span>
                    <span className="text-slate-900">
                      {formatCurrency(selectedOrder.grand_total)}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
