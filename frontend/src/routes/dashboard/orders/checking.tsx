import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import {
  Search,
  Package,
  MapPin,
  Phone,
  ShoppingBag,
  Loader2,
  ChevronRight,
  Printer,
  User,
} from "lucide-react";
import { useGetOrderDetailByCode } from "../../../hooks/Admin";
import { toast } from "react-toastify";

export const Route = createFileRoute("/dashboard/orders/checking")({
  component: OrderSearchPage,
});

export function OrderSearchPage() {
  const [orderCode, setOrderCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: orderResponse, isLoading } =
    useGetOrderDetailByCode(searchQuery);
  const order = orderResponse?.data;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderCode.trim()) {
      toast.error("Vui lòng nhập mã đơn hàng");
      return;
    }
    setSearchQuery(orderCode);
  };

  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  return (
    <div className="p-10 max-w-6xl mx-auto bg-[#FFFFFF] min-h-screen text-slate-800 font-sans">
      {/* 1. THANH TÌM KIẾM - GIẢN DỊ */}
      <div className="mb-16 max-w-2xl">
        <h1 className="text-2xl font-light text-slate-900 mb-2">
          Tra cứu đơn hàng sản phẩm
        </h1>
        <p className="text-sm text-slate-400 mb-6 font-normal">
          Quản lý và truy xuất dữ liệu đơn hàng hệ thống
        </p>

        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Nhập mã đơn hàng..."
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white transition-all"
            />
          </div>
          <button
            type="submit"
            className="bg-slate-900 text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Search size={16} />
            )}
            Tìm kiếm
          </button>
        </form>
      </div>

      {order ? (
        <div className="animate-in fade-in duration-500">
          {/* 2. THÔNG TIN CHUNG - GRID 4 CỘT */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 pb-8 border-b border-slate-100">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                Mã đơn hàng
              </p>
              <p className="text-sm font-semibold">{order.order_code}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                Ngày đặt
              </p>
              <p className="text-sm font-semibold">
                {new Date(order.created_at).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                Trạng thái
              </p>
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
                {order.order_status}
              </span>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                Thanh toán
              </p>
              <p className="text-sm font-semibold">
                {order.payment_method} ({order.payment_status})
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* 3. BÊN TRÁI: ĐỊA CHỈ & SẢN PHẨM (8 columns) */}
            <div className="lg:col-span-8 space-y-12">
              {/* Địa chỉ giao hàng - Minimalist */}
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <MapPin size={18} className="text-slate-900" />
                  <h3 className="text-sm font-bold uppercase tracking-widest">
                    Thông tin giao nhận
                  </h3>
                </div>
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase mb-1">
                        Người nhận
                      </p>
                      <p className="text-sm font-medium">
                        {order.recipient_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase mb-1">
                        Điện thoại
                      </p>
                      <p className="text-sm font-medium">
                        {order.recipient_phone}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase mb-1">
                      Địa chỉ đầy đủ
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {order.shipping_address}
                    </p>
                  </div>
                </div>
              </section>

              {/* Danh sách sản phẩm - Table style */}
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <ShoppingBag size={18} className="text-slate-900" />
                  <h3 className="text-sm font-bold uppercase tracking-widest">
                    Sản phẩm đã chọn
                  </h3>
                </div>
                <div className="space-y-4">
                  {order.order_items?.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-6 py-4 border-b border-slate-50 last:border-0 group"
                    >
                      <div className="w-16 h-16 bg-slate-50 rounded border border-slate-100 overflow-hidden">
                        <img
                          src={item.variant?.image_url || "/placeholder.png"}
                          className="w-full h-full object-cover opacity-90"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-slate-800">
                          {item.variant?.product?.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {item.variant?.color} / {item.variant?.size} — SKU:{" "}
                          {item.variant?.sku}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">
                          {formatCurrency(item.unit_price)}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Số lượng: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* 4. BÊN PHẢI: TỔNG TIỀN (4 columns) */}
            <div className="lg:col-span-4">
              <div className="sticky top-10 space-y-6">
                <div className="border border-slate-200 rounded-xl p-8">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest mb-6">
                    Tóm tắt đơn hàng
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-slate-500">
                      <span>Tạm tính</span>
                      <span>{formatCurrency(order.total_amount)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Vận chuyển</span>
                      <span>{formatCurrency(order.shipping_fee)}</span>
                    </div>
                    {parseFloat(order.discount_amount) > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Giảm giá</span>
                        <span>-{formatCurrency(order.discount_amount)}</span>
                      </div>
                    )}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-baseline">
                      <span className="font-bold">Tổng cộng</span>
                      <span className="text-2xl font-semibold text-slate-900">
                        {formatCurrency(order.grand_total)}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-all text-slate-600">
                  <Printer size={16} /> In phiếu giao hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : searchQuery && !isLoading ? (
        <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-2xl">
          <p className="text-slate-400 text-sm font-light italic">
            Không tìm thấy dữ liệu cho mã đơn "{searchQuery}"
          </p>
        </div>
      ) : (
        <div className="py-40 flex flex-col items-center opacity-10">
          <Package size={60} strokeWidth={1} />
          <p className="mt-4 text-[10px] tracking-[0.3em] uppercase">
            Ready to fetch
          </p>
        </div>
      )}
    </div>
  );
}
