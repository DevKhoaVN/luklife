const CardVochuer = ({ code, discount, minOrder, currency = "₫" }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="max-w-xs md:max-w-md mx-auto my-4">
      {/* Container chính: Màu nền trắng, bóng nhẹ, hình chữ nhật */}
      <div className="flex bg-white rounded-lg shadow-xl overflow-hidden">
        {/* === PHẦN BÊN TRÁI (THÔNG TIN) === */}
        {/* Relative để căn chỉnh đường nét đứt ::after */}
        <div className="relative flex-1 p-4 sm:p-6 coupon-separator">
          {/* Discount amount */}
          <p className="text-sm sm:text-lg font-bold title-primary mb-2">
            Giảm đến {discount}
          </p>

          {/* Coupon Code */}
          <div className="mb-2">
            <span className=" sm:text-sm text-gray-800 mr-2">Nhập mã</span>
            <span className=" sm:text-sm font-extrabold tracking-wider text-gray-900">
              {code}
            </span>
          </div>

          {/* Minimum Order Value */}
          <p className="text-xs sm:text-sm text-gray-700">
            Cho đơn hàng từ {minOrder.toLocaleString("vi-VN")}
            {currency}
          </p>

          {/* Hiệu ứng khoét tròn (Tùy chọn) */}
          <div className="coupon-left-end"></div>
        </div>

        {/* === PHẦN BÊN PHẢI (SAO CHÉP) === */}
        <div className="w-24 sm:w-28 flex items-center justify-center bg-gray-50/50">
          <button
            onClick={handleCopy}
            className="w-full mx-2 py-2 sm:py-3 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm rounded transition duration-200 shadow-md"
          >
            Sao chép mã
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardVochuer;
