import React, { useContext, useMemo } from "react";
import { ArrowRight, ChevronRight, House } from "lucide-react";
import CartItem from "./CartItem";
import { Link, useNavigate } from "@tanstack/react-router";
import AppContext from "../../../context/AppContext";
import { useDeleteCartItem, useUpdateCart } from "../../../hooks/useCart";

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, user } = useContext(AppContext);

  // Mutations
  const { mutate: updateCartMutate, isPending: isUpdating } = useUpdateCart();
  const { mutate: removeCartMutate, isPending: isRemoving } =
    useDeleteCartItem();

  console.log("Cart Data:", cartItems);

  // ✅ MAP DỮ LIỆU TỪ API SANG FORMAT HIỂN THỊ
  const mappedItems = useMemo(() => {
    if (!cartItems?.items || cartItems.items.length === 0) {
      return [];
    }

    return cartItems.items.map((item) => {
      const variant = item.variant;
      const product = variant?.product;

      return {
        id: item.id, // cart_item_id
        cartId: item.cart_id,
        variantId: item.variant_id,
        name: product?.name || "Sản phẩm không xác định",
        variant: `${variant?.color || "N/A"} / Size ${variant?.size || "N/A"}`,
        color: variant?.color,
        size: variant?.size,
        sku: variant?.sku,
        originalPrice: parseFloat(variant?.sale_price || 0),
        price: parseFloat(item.price || 0),
        quantity: item.quantity,
        stockQuantity: variant?.stock_quantity || 0,
        image: product?.thumbnail || variant?.image_url || "",
        productSlug: product?.slug || "",
        discount: product?.discount_percentage || 0,
      };
    });
  }, [cartItems]);

  // ✅ TÍNH TỔNG TIỀN
  const totalAmount = useMemo(() => {
    return mappedItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  }, [mappedItems]);

  // ✅ FORMAT TIỀN TỆ VNĐ
  const formatCurrency = (amount) => {
    return amount
      .toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      })
      .replace("₫", "đ");
  };

  // ✅ XỬ LÝ CẬP NHẬT SỐ LƯỢNG - TÍCH HỢP API
  const updateQuantity = (cartItemId, newQuantity) => {
    console.log("🔵 updateQuantity called with:", { cartItemId, newQuantity });

    if (newQuantity < 1) {
      alert("Số lượng phải lớn hơn 0!");
      return;
    }

    // Tìm item để lấy thông tin cần thiết
    const item = mappedItems.find((i) => i.id === cartItemId);
    if (!item) {
      console.error("❌ Không tìm thấy item với id:", cartItemId);
      return;
    }

    // Kiểm tra stock
    if (newQuantity > item.stockQuantity) {
      alert(`Chỉ còn ${item.stockQuantity} sản phẩm trong kho!`);
      return;
    }

    console.log("🔵 Calling API with:", {
      variantId: item.variantId,
      quantity: newQuantity,
      cartId: item.cartId,
      price: item.price,
    });

    // ✅ GỌI API VỚI ĐÚNG PARAMS
    updateCartMutate(
      {
        variantId: item.variantId,
        quantity: newQuantity,
        cartId: item.cartId,
        price: item.price,
      },
      {
        onSuccess: (response) => {
          console.log("✅ Cập nhật số lượng thành công:", response);
        },
        onError: (error) => {
          console.error("❌ Lỗi khi cập nhật:", error);
          alert(
            "Lỗi: " +
              (error?.response?.data?.message || "Không thể cập nhật số lượng")
          );
        },
      }
    );
  };

  // ✅ XỬ LÝ XÓA SẢN PHẨM - TÍCH HỢP API
  const removeItem = (cartItemId) => {
    console.log("🔴 removeItem called with:", cartItemId);

    // Tìm item để lấy thông tin cần thiết
    const item = mappedItems.find((i) => i.id === cartItemId);
    if (!item) {
      console.error("❌ Không tìm thấy item với id:", cartItemId);
      return;
    }

    console.log("🔴 Calling API with:", {
      cartId: item.cartId,
      variantId: item.variantId,
    });

    // ✅ GỌI API VỚI ĐÚNG PARAMS
    removeCartMutate(
      {
        cartId: item.cartId,
        variantId: item.variantId,
      },
      {
        onSuccess: (response) => {
          console.log("✅ Xóa sản phẩm thành công:", response);
        },
        onError: (error) => {
          console.error("❌ Lỗi khi xóa:", error);
          alert(
            "Lỗi: " +
              (error?.response?.data?.message || "Không thể xóa sản phẩm")
          );
        },
      }
    );
  };

  // ✅ XỬ LÝ THANH TOÁN
  const handleCheckout = () => {
    if (!user) {
      navigate({ to: "/auth/login" });
      return;
    }

    if (mappedItems.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }

    navigate({ to: "/checkout" });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 font-sans text-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav
          className="flex items-center text-sm text-gray-500 mb-6"
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link
                to="/"
                className="inline-flex items-center font-medium text-gray-700 hover:text-red-600 transition duration-150 ease-in-out"
              >
                <House size={16} className="mr-2" /> Trang chủ
              </Link>
            </li>

            <li>
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </li>

            <li aria-current="page">
              <span className="text-gray-800 font-bold cursor-default">
                Giỏ hàng
              </span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* --- CỘT TRÁI: DANH SÁCH SẢN PHẨM --- */}
          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
              {/* Header Bảng */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">
                  GIỎ HÀNG{" "}
                  <span className="text-sm font-normal text-red-700 ml-2">
                    ({mappedItems.length} sản phẩm)
                  </span>
                </h2>
              </div>

              {/* List Items */}
              <div className="divide-y divide-gray-100">
                {mappedItems.length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="text-gray-400 mb-4">
                      <svg
                        className="mx-auto h-24 w-24"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg mb-4">
                      Giỏ hàng của bạn đang trống
                    </p>
                    <Link
                      to="/"
                      className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Tiếp tục mua sắm
                    </Link>
                  </div>
                ) : (
                  mappedItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      updateQuantity={updateQuantity}
                      removeItem={removeItem}
                      formatCurrency={formatCurrency}
                      isUpdating={isUpdating}
                      isRemoving={isRemoving}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Nút quay lại mua sắm */}
            {mappedItems.length > 0 && (
              <div className="mt-6">
                <Link
                  to="/"
                  className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
                >
                  <ChevronRight size={20} className="rotate-180 mr-1" />
                  Tiếp tục mua sắm
                </Link>
              </div>
            )}
          </div>

          {/* --- CỘT PHẢI: TỔNG KẾT --- */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-200">
              <div className="bg-gray-50 px-6 py-4">
                <h3 className="text-lg font-bold text-gray-800 uppercase">
                  Đơn hàng
                </h3>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between text-base">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-base border-t border-dashed pt-4">
                  <span className="font-bold text-gray-800">Tổng tiền:</span>
                  <span className="text-2xl font-bold text-red-600 tracking-tight">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={
                    mappedItems.length === 0 || isUpdating || isRemoving
                  }
                  className="group relative w-full overflow-hidden rounded bg-red-800 py-3.5 text-center font-bold text-white shadow-md transition-all hover:bg-red-700 hover:shadow-lg focus:ring-4 focus:ring-red-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Link
                    to="/checkout"
                    className="flex items-center justify-center gap-2"
                  >
                    TIẾP TỤC THANH TOÁN
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </button>

                <div className="rounded bg-orange-100 p-3 text-center text-xs text-gray-800">
                  Bạn có thể nhập mã giảm giá ở bước tiếp theo
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
