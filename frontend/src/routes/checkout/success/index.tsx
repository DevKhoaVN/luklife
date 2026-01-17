import React, { useEffect } from "react";
import {
  Link,
  useNavigate,
  useSearch,
  createFileRoute,
} from "@tanstack/react-router";
import { CheckCircle, Package, CreditCard, MapPin, Home } from "lucide-react";

export const Route = createFileRoute("/checkout/success/")({
  component: OrderSuccessPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      orderCode: (search.orderCode as string) || "N/A",
      orderId: (search.orderId as number) || 0,
      grandTotal: (search.grandTotal as string) || "0",
    };
  },
});

function OrderSuccessPage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: "/checkout/success" });

  // Lấy thông tin từ URL params hoặc state
  const orderCode = searchParams?.orderCode || "N/A";
  const orderId = searchParams?.orderId || "";
  const grandTotal = searchParams?.grandTotal || "0";

  useEffect(() => {
    // Scroll to top khi vào trang
    window.scrollTo(0, 0);
  }, []);

  const formatCurrency = (amount: string | number) => {
    return parseFloat(amount.toString())
      .toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      })
      .replace("₫", "đ");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12">
      <div className="mx-auto max-w-3xl px-4">
        {/* Success Icon & Message */}
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-green-100 p-6">
              <CheckCircle className="h-20 w-20 text-green-600" />
            </div>
          </div>

          <h1 className="mb-3 text-3xl font-bold text-gray-900">
            Đặt hàng thành công! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            Cảm ơn bạn đã tin tưởng mua sắm tại cửa hàng của chúng tôi
          </p>
        </div>

        {/* Order Details Card */}
        <div className="mb-6 overflow-hidden rounded-xl bg-white shadow-lg">
          {/* Header */}
          <div className="border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">
              Thông tin đơn hàng
            </h2>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Order Code */}
            <div className="mb-6 rounded-lg border-2 border-green-200 bg-green-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm text-gray-600">Mã đơn hàng</p>
                  <p className="text-xl font-bold text-green-700">
                    {orderCode}
                  </p>
                </div>
                <Package className="h-10 w-10 text-green-600" />
              </div>
            </div>

            {/* Payment Info */}
            <div className="mb-4 flex items-start gap-4 rounded-lg bg-gray-50 p-4">
              <div className="rounded-full bg-blue-100 p-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-semibold text-gray-900">
                  Phương thức thanh toán
                </h3>
                <p className="text-sm text-gray-600">
                  Thanh toán khi nhận hàng (COD)
                </p>
                <p className="mt-2 text-sm font-medium text-gray-700">
                  Tổng tiền:{" "}
                  <span className="text-lg font-bold text-red-600">
                    {formatCurrency(grandTotal)}
                  </span>
                </p>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 flex-shrink-0 text-yellow-600" />
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">
                    Thông tin giao hàng
                  </h3>
                  <p className="text-sm text-gray-700">
                    Đơn hàng sẽ được giao đến địa chỉ bạn đã cung cấp trong 2-5
                    ngày làm việc
                  </p>
                  <p className="mt-2 text-sm font-medium text-yellow-700">
                    💡 Bạn sẽ nhận được email/SMS xác nhận đơn hàng trong ít
                    phút
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow-lg">
          <h3 className="mb-4 font-bold text-gray-900">Bước tiếp theo</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                1
              </span>
              <p>
                Kiểm tra email hoặc tin nhắn để xem thông tin chi tiết đơn hàng
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                2
              </span>
              <p>Theo dõi trạng thái đơn hàng trong mục "Đơn hàng của tôi"</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                3
              </span>
              <p>Chuẩn bị thanh toán khi nhận hàng từ shipper</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Link
            to="/orders"
            className="flex items-center justify-center gap-2 rounded-lg border-2 border-green-600 bg-white px-6 py-3 font-semibold text-green-700 transition-all hover:bg-green-50"
          >
            <Package className="h-5 w-5" />
            Xem đơn hàng của tôi
          </Link>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-all hover:bg-green-700"
          >
            <Home className="h-5 w-5" />
            Tiếp tục mua sắm
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-4 text-center">
          <p className="text-sm text-gray-600">
            Cần hỗ trợ?{" "}
            <a
              href="tel:1900xxxx"
              className="font-medium text-green-600 hover:underline"
            >
              Hotline: 1900 xxxx
            </a>{" "}
            hoặc{" "}
            <a
              href="mailto:support@example.com"
              className="font-medium text-green-600 hover:underline"
            >
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
