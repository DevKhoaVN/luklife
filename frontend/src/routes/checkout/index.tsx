// src/routes/checkout/index.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout/")({
  component: CheckoutPage,
});

// src/pages/CheckoutPage.tsx
import React, { useState, useEffect, useContext, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  MapPin,
  CreditCard,
  Package,
  Minus,
  Plus,
  X,
  Tag,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useGetAddresses } from "../../hooks/useUser";
import { useUpdateCart } from "../../hooks/useCart";
import AppContext from "../../context/AppContext";
import { toast } from "react-toastify";
import { getImageUrl } from "../../utils/inedx";
import { useApplyDiscount } from "../../hooks/Discounts";
import { useCheckout } from "../../hooks/Checkout";

interface AddressFormData {
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  street: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, user } = useContext(AppContext);

  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);

  // address data mutate
  const { data: addressesData, isLoading: isLoadingAddresses } =
    useGetAddresses();
  // cart update mutate
  const { mutate: updateCartMutate, isPending: isUpdatingCart } =
    useUpdateCart();
  //apply discount mutate
  const { mutate: applyDiscountMutate, isPending: isApplyingDiscount } =
    useApplyDiscount();
  // checkout mutate
  const { mutate: checkoutMutate, isPending: isCheckingOut } = useCheckout();

  // ✅ React Hook Form cho Address
  const {
    register: registerAddress,
    handleSubmit: handleSubmitAddress,
    formState: { errors: addressErrors },
    reset: resetAddress,
  } = useForm<AddressFormData>({
    defaultValues: {
      fullName: "",
      phone: "",
      province: "",
      district: "",
      ward: "",
      street: "",
    },
  });

  // ✅ React Hook Form cho Coupon
  const {
    register: registerCoupon,
    handleSubmit: handleSubmitCoupon,
    formState: { errors: couponErrors },
    reset: resetCoupon,
    watch,
  } = useForm<CouponFormData>({
    defaultValues: {
      couponCode: "",
    },
    mode: "onChange", // Validate khi typing
  });

  const couponCodeValue = watch("couponCode");
  // ✅ REDIRECT NẾU CHƯA LOGIN
  useEffect(() => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thanh toán");
      navigate({ to: "/auth/login" });
    }
  }, [user, navigate]);

  // ✅ REDIRECT NẾU GIỎ HÀNG TRỐNG
  useEffect(() => {
    if (cartItems?.items?.length === 0) {
      toast.error("Giỏ hàng trống!");
      navigate({ to: "/cart" });
    }
  }, [cartItems, navigate]);

  // ✅ AUTO SELECT DEFAULT ADDRESS
  useEffect(() => {
    if (addressesData?.data && addressesData.data.length > 0) {
      const defaultAddr = addressesData.data.find(
        (addr: any) => addr.is_default
      );
      setSelectedAddress(defaultAddr || addressesData.data[0]);
    }
  }, [addressesData]);

  // ✅ MAP CART ITEMS
  const mappedItems = useMemo(() => {
    if (!cartItems?.items || cartItems.items.length === 0) {
      return [];
    }

    return cartItems.items.map((item) => {
      const variant = item.variant;
      const product = variant?.product;

      return {
        id: item.id,
        cartId: item.cart_id,
        variantId: item.variant_id,
        name: product?.name || "Sản phẩm không xác định",
        color: variant?.color || "N/A",
        size: variant?.size || "N/A",
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

  // ✅ TÍNH TỔNG TIỀN với discount
  const orderSummary = useMemo(() => {
    const subtotal = mappedItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    let shipping = subtotal > 0 ? 30000 : 0;
    let discount = 0;

    if (appliedDiscount) {
      discount = appliedDiscount.discount_amount;

      if (appliedDiscount.discount_type === "free_shipping") {
        shipping = 0;
      }
    }

    return {
      subtotal,
      shipping,
      discount,
      total: subtotal + shipping - discount,
    };
  }, [mappedItems, appliedDiscount]);

  // ✅ FORMAT CURRENCY
  const formatCurrency = (amount: number) => {
    return amount
      .toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      })
      .replace("₫", "đ");
  };

  // ✅ FORMAT DISCOUNT VALUE
  const formatDiscountValue = (type: string, value: string) => {
    if (type === "percentage") {
      return `${value}%`;
    } else if (type === "fixed") {
      return formatCurrency(parseFloat(value));
    }
    return "Miễn phí vận chuyển";
  };

  // ✅ HANDLER: Apply coupon (với React Hook Form)
  const onSubmitCoupon = (data) => {
    if (orderSummary.subtotal === 0) {
      toast.error("Giỏ hàng trống");
      return;
    }
    console.log("data coupone : ", data);

    applyDiscountMutate(
      {
        code: data.couponCode.trim().toUpperCase(),
        order_value: orderSummary.subtotal,
      },
      {
        onSuccess: (response) => {
          if (response.success) {
            setAppliedDiscount(response.data);
            toast.success(
              response.message || "Áp dụng mã giảm giá thành công!"
            );
          }
        },
        onError: (error: any) => {
          const errorMessage =
            error.response?.data?.message || "Mã giảm giá không hợp lệ";
          toast.error(errorMessage);
        },
      }
    );
  };

  // ✅ HANDLER: Remove coupon
  const handleRemoveCoupon = () => {
    setAppliedDiscount(null);
    resetCoupon();
    toast.info("Đã xóa mã giảm giá");
  };

  // ✅ UPDATE QUANTITY
  const updateQuantity = (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      toast.error("Số lượng phải lớn hơn 0!");
      return;
    }

    const item = mappedItems.find((i) => i.id === cartItemId);
    if (!item) return;

    if (newQuantity > item.stockQuantity) {
      toast.error(`Chỉ còn ${item.stockQuantity} sản phẩm trong kho!`);
      return;
    }

    updateCartMutate(
      {
        variantId: item.variantId,
        quantity: newQuantity,
        cartId: item.cartId,
        price: item.price,
      },
      {
        onSuccess: () => {
          console.log("✅ Cập nhật số lượng thành công");
        },
        onError: (error: any) => {
          console.error("❌ Lỗi khi cập nhật:", error);
          toast.error("Không thể cập nhật số lượng");
        },
      }
    );
  };

  // ✅ ADDRESS HANDLERS
  const handleSelectAddress = (address: any) => {
    setSelectedAddress(address);
    setShowAddressModal(false);
  };

  const onSubmitNewAddress = (data: AddressFormData) => {
    const newAddress = {
      id: Date.now(),
      recipient_name: data.fullName,
      recipient_phone: data.phone,
      address_line1: data.street,
      ward: data.ward,
      district: data.district,
      city: data.province,
      is_default: false,
      isTemporary: true,
    };

    setSelectedAddress(newAddress);
    setShowAddressModal(false);
    toast.success("Đã thêm địa chỉ giao hàng");
    resetAddress();
  };

  //  CHECKOUT
  const handleCheckout = () => {
    if (!selectedAddress) {
      toast.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    if (mappedItems.length === 0) {
      toast.error("Giỏ hàng trống!");
      return;
    }

    // Format địa chỉ đầy đủ
    const fullAddress = `${selectedAddress.address_line1}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.city}`;

    const checkoutData = {
      recipient_name: selectedAddress.recipient_name,
      recipient_phone: selectedAddress.recipient_phone,
      shipping_address: fullAddress,
      payment_method: paymentMethod,
      discount_code: appliedDiscount?.discount_code,
      cart_items: mappedItems.map((item) => ({
        variant_id: item.variantId,
        quantity: item.quantity,
        unit_price: item.price,
      })),
    };

    checkoutMutate(checkoutData, {
      onSuccess: (response) => {
        if (response.success) {
          if (response.data.payment_url) {
            // Chuyển hướng đến URL thanh toán của VNPAY
            window.location.href = response.data.payment_url;
          }
          toast.success("Đặt hàng thành công!");
          console.log("response order ", response);
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4">
        {/* Back to Cart */}
        <Link
          to="/cart"
          className="mb-6 inline-flex items-center text-sm text-gray-600 hover:text-red-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại giỏ hàng
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Shipping & Payment */}
          <div className="space-y-6 lg:col-span-2">
            {/* Shipping Address */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-700" />
                <h2 className="text-lg font-bold uppercase text-gray-900">
                  Địa chỉ giao hàng
                </h2>
              </div>

              {isLoadingAddresses ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-red-700" />
                  <span className="ml-2 text-sm text-gray-600">
                    Đang tải địa chỉ...
                  </span>
                </div>
              ) : selectedAddress ? (
                <div className="rounded-lg border-l-4 border-red-600 bg-gray-50 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="mb-2 flex items-center gap-3">
                        <span className="font-semibold text-gray-900">
                          {selectedAddress.recipient_name}
                        </span>
                        <span className="text-gray-600">
                          {selectedAddress.recipient_phone}
                        </span>
                        {selectedAddress.isTemporary && (
                          <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">
                            Địa chỉ mới
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {selectedAddress.address_line1}
                        {selectedAddress.ward && `, ${selectedAddress.ward}`}
                        {selectedAddress.district &&
                          `, ${selectedAddress.district}`}
                        {selectedAddress.city && `, ${selectedAddress.city}`}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAddressModal(true)}
                      className="text-sm text-red-700 hover:underline"
                    >
                      Thay đổi
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                  <MapPin className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                  <p className="mb-4 text-sm text-gray-600">
                    Bạn chưa có địa chỉ giao hàng
                  </p>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-800"
                  >
                    Thêm địa chỉ giao hàng
                  </button>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-gray-700" />
                <h2 className="text-lg font-bold uppercase text-gray-900">
                  Phương thức thanh toán
                </h2>
              </div>

              <div className="space-y-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 transition-all hover:border-red-600">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">
                    Thanh toán khi nhận hàng (COD)
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 transition-all hover:border-red-600">
                  <input
                    type="radio"
                    name="payment"
                    value="vnpay"
                    checked={paymentMethod === "vnpay"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">
                    Thẻ ATM/Visa/Master/JCB/QR Pay qua VNPAY-QR
                  </span>
                </label>
              </div>
            </div>

            {/* Cart Items */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-gray-700" />
                <h2 className="text-lg font-bold uppercase text-gray-900">
                  Giỏ hàng ({mappedItems.length} sản phẩm)
                </h2>
              </div>

              {/* Table Header - Desktop */}
              <div className="mb-4 hidden grid-cols-12 gap-4 border-b border-gray-200 pb-3 text-sm font-semibold text-gray-700 md:grid">
                <div className="col-span-5">Tên Hàng</div>
                <div className="col-span-2 text-center">Giá</div>
                <div className="col-span-3 text-center">Số Lượng</div>
                <div className="col-span-2 text-right">Tổng Tiền</div>
              </div>

              {/* Product List */}
              <div className="space-y-4">
                {mappedItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 gap-4 border-b border-gray-100 pb-4 last:border-0 md:grid-cols-12"
                  >
                    {/* Product Info */}
                    <div className="col-span-1 flex gap-4 md:col-span-5">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="mb-2 text-sm font-medium text-gray-900 line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-600">
                          Màu: <span className="font-medium">{item.color}</span>
                        </p>
                        <p className="text-xs text-gray-600">
                          Size: <span className="font-medium">{item.size}</span>
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-1 flex flex-col items-start justify-center md:col-span-2 md:items-center">
                      <span className="text-sm font-semibold text-red-600">
                        {formatCurrency(item.price)}
                      </span>
                      {item.discount > 0 && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatCurrency(item.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="col-span-1 flex items-center justify-start md:col-span-3 md:justify-center">
                      <div className="flex items-center rounded-lg border border-gray-300">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={isUpdatingCart || item.quantity <= 1}
                          className="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={
                            isUpdatingCart ||
                            item.quantity >= item.stockQuantity
                          }
                          className="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      {item.quantity >= item.stockQuantity && (
                        <span className="ml-2 text-xs text-orange-600">
                          Hết hàng
                        </span>
                      )}
                    </div>

                    {/* Total */}
                    <div className="col-span-1 flex items-center justify-start md:col-span-2 md:justify-end">
                      <span className="text-sm font-bold text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              {/* ✅ COUPON SECTION - Fixed height để không bị phình */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Tag className="h-5 w-5 text-gray-700" />
                  <h3 className="text-sm font-bold uppercase text-gray-900">
                    Mã giảm giá
                  </h3>
                </div>

                {!appliedDiscount ? (
                  <form onSubmit={handleSubmitCoupon(onSubmitCoupon)}>
                    <div className="space-y-2">
                      {/* Input và Button cùng hàng với height cố định */}
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <input
                            type="text"
                            {...registerCoupon("couponCode", {
                              required: "Vui lòng nhập mã giảm giá",
                              minLength: {
                                value: 3,
                                message: "Mã phải có ít nhất 3 ký tự",
                              },
                              maxLength: {
                                value: 50,
                                message: "Mã không được quá 50 ký tự",
                              },
                              pattern: {
                                value: /^[A-Z0-9]+$/,
                                message: "Chỉ chứa chữ HOA và số",
                              },
                            })}
                            placeholder="Nhập mã giảm giá"
                            disabled={isApplyingDiscount}
                            className={`w-full rounded border px-3 py-2 text-sm uppercase focus:outline-none disabled:bg-gray-100 ${
                              couponErrors.couponCode
                                ? "border-red-500 focus:border-red-600"
                                : "border-gray-300 focus:border-red-700"
                            }`}
                            style={{ textTransform: "uppercase" }}
                          />
                        </div>

                        {/* Button với min-width để không bị co giãn */}
                        <button
                          type="submit"
                          disabled={
                            isApplyingDiscount || !couponCodeValue?.trim()
                          }
                          className="flex h-[38px] min-w-[80px] items-center justify-center rounded bg-red-700 px-4 text-sm font-medium text-white transition-colors hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                          {isApplyingDiscount ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Áp dụng"
                          )}
                        </button>
                      </div>

                      {/* Error message với min-height để không làm nhảy layout */}
                      <div className="min-h-[20px]">
                        {couponErrors.couponCode && (
                          <p className="text-xs text-red-600">
                            {couponErrors.couponCode.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {/* Applied Coupon Display - Tông xanh lá nhẹ, tinh tế */}
                    <div className="rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Badge mã giảm giá - Xanh lục nhạt */}
                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                              {appliedDiscount.discount_code}
                            </span>

                            {/* Giá trị giảm - Text xanh đậm */}
                            <span className="text-sm font-medium text-emerald-700">
                              {formatDiscountValue(
                                appliedDiscount.discount_type,
                                appliedDiscount.discount_value
                              )}
                            </span>
                          </div>

                          {/* Tên chương trình */}
                          <p className="text-base font-semibold text-slate-800">
                            {appliedDiscount.discount_name}
                          </p>

                          {/* Tiết kiệm */}
                          <p className="text-sm font-medium text-emerald-700">
                            Tiết kiệm:{" "}
                            <span className="font-bold text-emerald-800">
                              {formatCurrency(appliedDiscount.discount_amount)}
                            </span>
                          </p>
                        </div>

                        {/* Nút xóa - Icon xám nhẹ, hover sang xanh/đỏ tùy ý */}
                        <button
                          onClick={handleRemoveCoupon}
                          className="rounded-full p-2 text-slate-400 transition-all hover:bg-emerald-100 hover:text-emerald-600 active:scale-95"
                          title="Xóa mã giảm giá"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Nút đổi mã khác - Border xanh rất nhẹ */}
                    <button
                      onClick={handleRemoveCoupon}
                      className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-2.5 text-sm font-medium text-emerald-700 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:ring-offset-2"
                    >
                      Sử dụng mã giảm giá khác
                    </button>
                  </div>
                )}
              </div>

              {/* ✅ ORDER SUMMARY */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-lg font-bold uppercase text-gray-900">
                  Đơn hàng
                </h2>

                <div className="space-y-4 border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(orderSummary.subtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-medium text-gray-900">
                      {orderSummary.shipping === 0 &&
                      appliedDiscount?.discount_type === "free_shipping" ? (
                        <span className="text-green-600">Miễn phí</span>
                      ) : (
                        formatCurrency(orderSummary.shipping)
                      )}
                    </span>
                  </div>

                  {/* Chỉ hiển thị dòng giảm giá khi có discount */}
                  {appliedDiscount && orderSummary.discount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Giảm giá</span>
                        <span className="rounded  px-2 py-0.5 text-xs font-medium text-red-500">
                          {appliedDiscount.discount_code}
                        </span>
                      </div>
                      <span className="font-semibold text-red-500">
                        -{formatCurrency(orderSummary.discount)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="my-4 flex items-center justify-between border-b border-gray-200 pb-4">
                  <span className="text-base font-semibold text-gray-900">
                    Tổng thanh toán
                  </span>
                  <span className="text-xl font-bold text-red-600">
                    {formatCurrency(orderSummary.total)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={
                    !selectedAddress ||
                    mappedItems.length === 0 ||
                    isCheckingOut
                  }
                  className="w-full rounded-lg bg-red-700 py-3 text-sm font-bold uppercase text-white shadow-md transition-all hover:bg-red-800 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {isCheckingOut ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </span>
                  ) : (
                    "Đặt hàng"
                  )}
                </button>

                {/* Chỉ hiển thị tip khi chưa có discount */}
                {!appliedDiscount && (
                  <div className="mt-4 rounded bg-orange-100 p-3 text-center text-xs text-gray-800">
                    💡 Nhập mã giảm giá ở phần trên để nhận ưu đãi
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal - SAME AS BEFORE */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg  uppercase font-semibold text-gray-900">
                Chọn địa chỉ giao hàng
              </h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="rounded p-1 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Existing Addresses */}
            {addressesData?.data && addressesData.data.length > 0 && (
              <div className="mb-6">
                <h4 className="mb-3 text-sm font-semibold text-gray-700">
                  Địa chỉ đã lưu
                </h4>
                <div className="space-y-3">
                  {addressesData.data.map((address: any) => (
                    <div
                      key={address.id}
                      onClick={() => handleSelectAddress(address)}
                      className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                        selectedAddress?.id === address.id
                          ? "border-red-200 bg-red-50"
                          : "border-gray-200 hover:border-red-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              {address.recipient_name}
                            </span>
                            {address.is_default && (
                              <span className="rounded border border-red-600 px-2 py-0.5 text-xs text-red-600">
                                Mặc định
                              </span>
                            )}
                          </div>
                          <p className="mb-1 text-sm text-gray-600">
                            SĐT: {address.recipient_phone}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.address_line1}, {address.ward},{" "}
                            {address.district}, {address.city}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Address Form */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="mb-4 text-sm font-semibold text-gray-700">
                Thêm địa chỉ mới
              </h4>

              <form onSubmit={handleSubmitAddress(onSubmitNewAddress)}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Họ và tên <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        {...registerAddress("fullName", {
                          required: "Họ và tên là bắt buộc",
                          minLength: {
                            value: 2,
                            message: "Họ và tên phải có ít nhất 2 ký tự",
                          },
                        })}
                        className={`w-full rounded border px-3 py-2 text-sm focus:outline-none ${
                          addressErrors.fullName
                            ? "border-red-500 focus:border-red-600"
                            : "border-gray-300 focus:border-red-700"
                        }`}
                        placeholder="Nhập họ và tên"
                      />
                      {addressErrors.fullName && (
                        <p className="mt-1 text-xs text-red-600">
                          {addressErrors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Số điện thoại <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="tel"
                        {...registerAddress("phone", {
                          required: "Số điện thoại là bắt buộc",
                          pattern: {
                            value: /^\d{10,11}$/,
                            message: "Số điện thoại phải có 10-11 chữ số",
                          },
                        })}
                        className={`w-full rounded border px-3 py-2 text-sm focus:outline-none ${
                          addressErrors.phone
                            ? "border-red-500 focus:border-red-600"
                            : "border-gray-300 focus:border-red-700"
                        }`}
                        placeholder="Ví dụ: 0987654321"
                      />
                      {addressErrors.phone && (
                        <p className="mt-1 text-xs text-red-600">
                          {addressErrors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Số nhà, tên đường <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      {...registerAddress("street", {
                        required: "Địa chỉ chi tiết là bắt buộc",
                        minLength: {
                          value: 5,
                          message: "Địa chỉ phải có ít nhất 5 ký tự",
                        },
                      })}
                      className={`w-full rounded border px-3 py-2 text-sm focus:outline-none ${
                        addressErrors.street
                          ? "border-red-500 focus:border-red-600"
                          : "border-gray-300 focus:border-red-700"
                      }`}
                      placeholder="Ví dụ: Số 10, Phố Hàng Bạc"
                    />
                    {addressErrors.street && (
                      <p className="mt-1 text-xs text-red-600">
                        {addressErrors.street.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Phường/Xã <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        {...registerAddress("ward", {
                          required: "Phường/Xã là bắt buộc",
                        })}
                        className={`w-full rounded border px-3 py-2 text-sm focus:outline-none ${
                          addressErrors.ward
                            ? "border-red-500 focus:border-red-600"
                            : "border-gray-300 focus:border-red-700"
                        }`}
                        placeholder="Ví dụ: Hàng Bạc"
                      />
                      {addressErrors.ward && (
                        <p className="mt-1 text-xs text-red-600">
                          {addressErrors.ward.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Quận/Huyện <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        {...registerAddress("district", {
                          required: "Quận/Huyện là bắt buộc",
                        })}
                        className={`w-full rounded border px-3 py-2 text-sm focus:outline-none ${
                          addressErrors.district
                            ? "border-red-500 focus:border-red-600"
                            : "border-gray-300 focus:border-red-700"
                        }`}
                        placeholder="Ví dụ: Hoàn Kiếm"
                      />
                      {addressErrors.district && (
                        <p className="mt-1 text-xs text-red-600">
                          {addressErrors.district.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Tỉnh/Thành phố <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        {...registerAddress("province", {
                          required: "Tỉnh/Thành phố là bắt buộc",
                        })}
                        className={`w-full rounded border px-3 py-2 text-sm focus:outline-none ${
                          addressErrors.province
                            ? "border-red-500 focus:border-red-600"
                            : "border-gray-300 focus:border-red-700"
                        }`}
                        placeholder="Ví dụ: Hà Nội"
                      />
                      {addressErrors.province && (
                        <p className="mt-1 text-xs text-red-600">
                          {addressErrors.province.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-red-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-800"
                  >
                    Sử dụng địa chỉ này
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
