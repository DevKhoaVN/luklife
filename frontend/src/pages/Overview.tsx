import React from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Search,
  TrendingUp,
} from "lucide-react";

import { useStaticData, useGetAllOrders } from "../hooks/Admin";

export function Overview() {
  const navigate = useNavigate();

  const { status = "all", page = 1 } = useSearch({
    from: "/dashboard",
  });

  /* =======================
      FETCH DATA (Logic giữ nguyên)
  ======================= */
  const { data: statsData, isLoading: statsLoading } = useStaticData();
  const { data: ordersData, isLoading: ordersLoading } = useGetAllOrders({
    status,
    page,
  });

  /* =======================
      HELPERS (Logic giữ nguyên)
  ======================= */
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 60000);
    if (diff < 1) return "Vừa xong";
    if (diff < 60) return `${diff} phút trước`;
    if (diff < 1440) return `${Math.floor(diff / 60)} giờ trước`;
    return date.toLocaleDateString("vi-VN");
  };

  const getStatusStyles = (status) =>
    ({
      pending: "bg-orange-50 text-orange-600 border-orange-100/50",
      confirmed: "bg-blue-50 text-blue-600 border-blue-100/50",
      processing: "bg-indigo-50 text-indigo-600 border-indigo-100/50",
      shipping: "bg-cyan-50 text-cyan-600 border-cyan-100/50",
      delivered: "bg-emerald-50 text-emerald-600 border-emerald-100/50",
      cancelled: "bg-red-50 text-red-600 border-red-100/50",
      returned: "bg-slate-100 text-slate-600 border-slate-200",
    })[status] || "bg-gray-50 text-gray-600 border-gray-100";

  const getStatusLabel = (status) =>
    ({
      pending: "Chờ xử lý",
      confirmed: "Đã xác nhận",
      processing: "Đang xử lý",
      shipping: "Đang giao",
      delivered: "Hoàn tất",
      cancelled: "Đã hủy",
      returned: "Trả hàng",
    })[status] || status;

  const getPaymentStatusStyles = (status) =>
    ({
      unpaid: "bg-slate-50 text-slate-500 border-slate-200",
      pending: "bg-amber-50 text-amber-600 border-amber-100/50",
      paid: "bg-emerald-50 text-emerald-600 border-emerald-100/50",
      failed: "bg-red-50 text-red-600 border-red-100/50",
      refunded: "bg-purple-50 text-purple-600 border-purple-100/50",
    })[status] || "bg-gray-50 text-gray-600 border-gray-100";

  const getPaymentStatusLabel = (status) =>
    ({
      unpaid: "Chưa thanh toán",
      pending: "Chờ thu",
      paid: "Đã thanh toán",
      failed: "Lỗi",
      refunded: "Hoàn tiền",
    })[status] || status;

  const stats = statsData?.success
    ? [
        {
          label: "Doanh thu",
          value: formatCurrency(statsData.data.revenue_stats),
          icon: DollarSign,
          bg: "bg-emerald-500/10",
          color: "text-emerald-600",
        },
        {
          label: "Đơn hàng",
          value: statsData.data.order_stats,
          icon: ShoppingCart,
          bg: "bg-blue-500/10",
          color: "text-blue-600",
        },
        {
          label: "Sản phẩm",
          value: statsData.data.product_stats ?? 0,
          icon: Package,
          bg: "bg-orange-500/10",
          color: "text-orange-600",
        },
        {
          label: "Khách hàng",
          value: statsData.data.user_stats ?? 0,
          icon: Users,
          bg: "bg-indigo-500/10",
          color: "text-indigo-600",
        },
      ]
    : [];

  const orders = ordersData?.success ? ordersData.data.data : [];
  const pagination = ordersData?.success ? ordersData.data : null;

  const handlePageChange = (newPage) => {
    navigate({
      to: "/dashboard",
      search: (prev) => ({ ...prev, page: newPage }),
    });
  };

  if (statsLoading || ordersLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="animate-spin text-slate-400" size={24} />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8 bg-[#fcfcfd] min-h-screen text-slate-600 font-sans">
      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm transition-all hover:shadow-md hover:border-slate-300/50"
          >
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-xl ${s.bg}`}>
                <s.icon className={s.color} size={20} />
              </div>
              <TrendingUp size={16} className="text-slate-300" />
            </div>
            <div className="mt-5">
              <p className="text-[13px] font-medium text-slate-400">
                {s.label}
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
                {s.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        {/* Header Table */}
        <div className="px-6 py-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 leading-none">
              Đơn hàng mới nhất
            </h2>
            <p className="text-sm text-slate-400 mt-1.5">
              Theo dõi và quản lý các giao dịch vừa phát sinh
            </p>
          </div>
          <button
            onClick={() => navigate({ to: "/dashboard/orders" })}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-all active:scale-95"
          >
            Tất cả đơn hàng <ArrowUpRight size={15} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
                  Mã đơn
                </th>
                <th className="px-6 py-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
                  Giao hàng
                </th>
                <th className="px-6 py-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
                  Thanh toán
                </th>
                <th className="px-6 py-4 text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length > 0 ? (
                orders.map((o) => (
                  <tr
                    key={o.id}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <span className="text-sm font-semibold text-slate-900">
                        #{o.order_code}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700">
                          {o.recipient_name}
                        </span>
                        <span className="text-xs text-slate-400">
                          {o.recipient_phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-slate-900">
                        {formatCurrency(o.grand_total)}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusStyles(o.order_status)}`}
                      >
                        {getStatusLabel(o.order_status)}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getPaymentStatusStyles(o.payment_status)}`}
                      >
                        {getPaymentStatusLabel(o.payment_status)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500">
                      {formatTimeAgo(o.created_at)}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() =>
                          navigate({
                            to: "/dashboard/orders",
                            search: { order_code: o.order_code },
                          })
                        }
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-slate-50 rounded-full">
                        <Search size={32} className="text-slate-300" />
                      </div>
                      <p className="text-sm font-medium text-slate-400">
                        Không có dữ liệu đơn hàng
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MODERN PAGINATION */}
        {pagination && pagination.total > 0 && (
          <div className="flex items-center justify-between px-6 py-5 border-t border-slate-100 bg-white">
            <span className="text-xs font-medium text-slate-500">
              Trang{" "}
              <span className="text-slate-900">{pagination.current_page}</span>{" "}
              / {pagination.last_page}
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={pagination.current_page <= 1}
                onClick={() => handlePageChange(pagination.current_page - 1)}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="h-6 w-[1px] bg-slate-200 mx-1" />

              <button
                disabled={pagination.current_page >= pagination.last_page}
                onClick={() => handlePageChange(pagination.current_page + 1)}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
