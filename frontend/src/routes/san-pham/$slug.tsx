// src/routes/products/$slug.tsx (hoặc src/pages/ProductDetailPage.tsx)
import { createFileRoute, Link, useMatches } from "@tanstack/react-router";
import Gift from "../../../public/assets/gift.svg";
import {
  Star,
  ShoppingCart,
  Truck,
  Copy,
  ChevronRight,
  Minus,
  Plus,
  ChevronDown,
  CheckCircle,
} from "lucide-react";
import React, { useState } from "react";

// Dữ liệu mẫu (Tích hợp dữ liệu từ hình ảnh)
const MOCK_PRODUCT_DATA = {
  productId: "40000032",
  productName: "Áo giữ nhiệt nam WarmMax Extra cổ cao 4cm",
  category: "Thời trang nam",
  sku: "2400000321583", //
  rating: 5,
  reviews: 1,
  sold: 28862, //
  oldPrice: 399000, //
  currentPrice: 199000, //
  discountPercent: 50, //
  sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
  colors: [
    { name: "Đen", hex: "#000000" },
    { name: "Ghi", hex: "#A9A9A9" },
    { name: "Trắng", hex: "#F5F5F5" },
    { name: "Than", hex: "#36454F" },
  ],
  mainImage:
    "https://tokyolife.vn/_next/image?url=https%3A%2F%2Fs3-hni02.higiocloud.vn%2Fgppm2%2Fprod%2Fcms%2F1736742302613117.JPG&w=1920&q=75", // Ảnh chính
  thumbnails: [
    //
    "https://tokyolife.vn/_next/image?url=https%3A%2F%2Fs3-hni02.higiocloud.vn%2Fgppm2%2Fprod%2Fcms%2F1736742302613117.JPG&w=1920&q=75",
    "https://tokyolife.vn/_next/image?url=https%3A%2F%2Fs3-hni02.higiocloud.vn%2Fgppm2%2Fprod%2Fcms%2F17644016521237552.png&w=640&q=75",
    "https://tokyolife.vn/_next/image?url=https%3A%2F%2Fs3-hni02.higiocloud.vn%2Fgppm2%2Fprod%2Fcms%2F1736742302613117.JPG&w=1920&q=75",
    "https://tokyolife.vn/_next/image?url=https%3A%2F%2Fs3-hni02.higiocloud.vn%2Fgppm2%2Fprod%2Fcms%2F1736742302613117.JPG&w=1920&q=75",
  ],
  // Dữ liệu Khuyến mãi
  vouchers: [
    //
    { code: "NEWA26", discount: "300.000đ", minOrder: "399.000đ", icon: Gift },
    { code: "YEARA26", discount: "100.000đ", minOrder: "699.000đ", icon: Gift },
    {
      code: "HAPPY2026",
      discount: "126.000đ",
      minOrder: "999.000đ",
      icon: Gift,
    },
    {
      code: "FREE_SHIP",
      discount: "Miễn phí vận chuyển 0đ",
      minOrder: "249.000đ",
      icon: Gift,
    }, //
  ],
  // Dữ liệu Mô tả sản phẩm
  shortDesc:
    "Được thiết kế như một lớp nến thông minh, sản phẩm giúp bạn giữ ấm cơ thể một cách hiệu quả mà vẫn đảm bảo vẻ ngoài gọn gàng, lịch lãm, không còn cảm giác nặng nề khi phải phối nhiều lớp trang phục.", //
  promoBanner: "/images/warmmax_extra_banner.jpg", //
  technicalFeatures: [
    "Giữ ấm vượt trội theo cơ chế tích nhiệt",
    "Siêu nhẹ, thoáng khí, co giãn 4 chiều",
    "Kháng khuẩn tự nhiên, hạn chế mùi hôi",
  ],
  materialComposition: [
    { label: "Thành phần chính", value: "95% Acrylic, 5% Spandex." },
    { label: "Công nghệ", value: "Sợi rỗng cách nhiệt." },
    { label: "Hướng dẫn bảo quản", value: "Giặt bằng máy ở chế độ nhẹ." },
  ],
};

// Định nghĩa Route (Giữ nguyên)
export const Route = createFileRoute("/san-pham/$slug")({
  loader: async () => MOCK_PRODUCT_DATA,
  component: ProductDetailPage,
});

// --- COMPONENT CHÍNH ---
function ProductDetailPage() {
  const data = Route.useLoaderData();
  const matches = useMatches();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState(data.colors[0].name); // Khởi tạo màu đầu tiên
  const [isDescOpen, setIsDescOpen] = useState(true);
  const [isMaterialOpen, setIsMaterialOpen] = useState(true);
  const [isFullDescExpanded, setIsFullDescExpanded] = useState(false); // Trạng thái "Xem thêm"

  // state manage image
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [mainImage, setMainImage] = useState(data.mainImage);

  // Tạo Breadcrumbs
  const getBreadcrumbs = () => {
    // Logic tạo Breadcrumbs từ matches
    const crumbs = [{ name: "Trang chủ", path: "/" }]; //
    crumbs.push({ name: "Sinh nhật Tokyolife", path: "/tokyolife-birthday" }); //
    crumbs.push({ name: data.productName, path: location.pathname }); //
    return crumbs;
  };
  const breadcrumbs = getBreadcrumbs();

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Đã sao chép mã: ${code}`);
  };

  const handleQuantityChange = (type: "plus" | "minus") => {
    setQuantity((prev) => {
      if (type === "plus") return prev + 1;
      if (type === "minus" && prev > 1) return prev - 1;
      return prev;
    });
  };

  const handleThumnailClick = (src: string) => {
    setMainImage(src);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* 1. BREADCRUMBS & TÊN SẢN PHẨM */}
      <nav
        className="flex items-center text-sm text-gray-500 mb-6"
        aria-label="Breadcrumb"
      >
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight size={14} className="mx-2" />}
            <Link
              to={crumb.path}
              className={`hover:text-red-600 transition-colors ${index === breadcrumbs.length - 1 ? "font-medium text-gray-800" : "text-gray-500"}`}
            >
              {crumb.name}
            </Link>
          </React.Fragment>
        ))}
      </nav>

      {/* 2. Cấu trúc 2 cột chính */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
        {/* CỘT 1: HÌNH ẢNH */}
        <div className="flex gap-4">
          {/* Thumbnails */}
          <div className="flex flex-col gap-2">
            {data.thumbnails.map((src, index) => (
              <img
                key={index}
                onClick={() => handleThumnailClick(src)}
                src={src}
                alt={`Thumbnail ${index + 1}`}
                className="w-20 h-20 object-cover border-2 border-gray-200 hover:border-red-600 cursor-pointer"
              />
            ))}
          </div>
          {/* Ảnh chính */}
          <div className="flex-1">
            <img
              src={mainImage}
              alt={data.productName}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* CỘT 2: THÔNG TIN SẢN PHẨM & MUA HÀNG */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {data.productName}
          </h1>{" "}
          {/* */}
          <p className="text-sm text-gray-600 mb-4">
            SKU:{" "}
            <span className=" text-sm text-gray-600 uppercase">{data.sku}</span>
          </p>{" "}
          {/* */}
          {/* ĐÁNH GIÁ & SỐ LƯỢNG BÁN */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center text-gray-500">
              {Array(data.rating)
                .fill(0)
                .map((_, i) => (
                  <Star key={i} size={16} fill="black" strokeWidth={0} />
                ))}
              <span className="text-sm ml-2">5 sao</span> {/* */}
            </div>
            <span className="text-sm text-gray-500 border-l pl-4">
              {data.reviews} đánh giá
            </span>{" "}
            {/* */}
            <span className="text-sm text-gray-500 border-l pl-4">
              {data.sold} đã bán
            </span>{" "}
            {/* */}
          </div>
          {/* <p className="price font-medium text-base mb-4">thời gian luo</p>{" "} */}
          {/* */}
          {/* GIÁ TIỀN */}
          <div className="mb-6">
            <p className="text-sm text-gray-500">
              Giá niêm yết cũ:{" "}
              <span className="line-through">
                {data.oldPrice.toLocaleString()}đ
              </span>
            </p>{" "}
            {/* */}
            <div className="flex items-end space-x-4">
              <p className="text-3xl font-bold   price">
                {data.currentPrice.toLocaleString()}đ
              </p>{" "}
              {/* */}
              <p className="text-base price font-semibold">
                Giảm {data.discountPercent}% so với giá niêm yết cũ
              </p>{" "}
              {/* */}
            </div>
          </div>
          {/* KHUYẾN MÃI - Clone UI từ hình ảnh */}
          <div className="border-b border-dashed border-gray-500 mb-4  h-0 w-full"></div>
          <div className="mb-8">
            <h2 className="text-md font-sans text-black font-bold mb-2">
              KHUYẾN MÃI
            </h2>
            <ul className="space-y-3">
              {data.vouchers.map((v, index) => {
                const Icon = v.icon;
                const isFreeShip = v.code === "FREE_SHIP";
                return (
                  <li
                    key={index}
                    className="flex items-start text-sm text-gray-700"
                  >
                    <img
                      src={Icon}
                      alt=""
                      className="mr-2 flex-shrink-0 mt-0.5"
                    />
                    {/* */}
                    <span className="flex-1 text-black font-medium">
                      {isFreeShip
                        ? `Giao nhanh và miễn phí vận chuyển 0đ toàn quốc cho đơn hàng từ ${v.minOrder}`
                        : `Giảm thêm  khi nhập mã ${v.code} tại bước thanh toán cho đơn từ ${v.minOrder}`}
                    </span>
                    {!isFreeShip && (
                      <button
                        onClick={() => copyToClipboard(v.code)}
                        className="ml-2 text-blue-600 hover:text-blue-800 transition duration-150 flex items-center flex-shrink-0"
                      >
                        Sao chép <Copy size={14} className="ml-1" />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
            {/* Giá độc quyền online */}
            <div className="inline-block mt-4 bg-orange-100 text-sm font-semibold text-orange-800 px-3 py-1 rounded">
              Giá độc quyền online {/* */}
            </div>
          </div>
          {/* LỰA CHỌN SIZE VÀ MUA HÀNG (Giữ nguyên) */}
          <div className="border-b border-dashed border-gray-500 mb-4  h-0 w-full"></div>
          {/* color */}
          <div className=" mt-4">
            {/* ... Size selector và nút Mua hàng ... */}
            <h2 className="text-md font-sans text-black font-bold mb-2">
              Màu sắc | <span className="text-gray-600">{selectedColor}</span>
            </h2>
            <div className="mt-2 flex space-x-3">
              {MOCK_PRODUCT_DATA.colors.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-16 h-8 text-white font-medium rounded-full border border-red-950 transition-all duration-200 ${selectedColor === color.hex ? "text-white bg-black " : "border-gray-300"}`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                ></button>
              ))}
            </div>
          </div>
          {/* size */}
          <div className=" mt-4">
            {/* ... Size selector và nút Mua hàng ... */}
            <h2 className="text-md font-sans text-black font-bold mb-2">
              Kích thước | <span className="text-gray-600">{selectedSize}</span>
            </h2>
            <div className="mt-2 flex space-x-3">
              {MOCK_PRODUCT_DATA.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-16 h-8 font-medium rounded-full border border-red-950 transition-all duration-200 ${selectedSize === size ? "text-white bg-black " : "border-gray-300"}`}
                  title={size}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className=" flex justify-between mt-6">
            {/* ... Số lượng và nút Mua hàng ... */}
            <h2 className="text-md font-sans text-black font-bold mb-2">
              Chọn số lượng | <span className="text-gray-600">{quantity}</span>
            </h2>
            <div className="flex items-center space-x-6">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange("minus")}
                  disabled={quantity <= 1}
                  className="p-2 text-gray-600 disabled:opacity-50 hover:bg-gray-100 rounded-l-lg"
                >
                  <Minus size={18} />
                </button>

                <span className="px-4 text-lg font-medium select-none">
                  {quantity}
                </span>

                <button
                  onClick={() => handleQuantityChange("plus")}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center gap-10 mt-6">
            <button
              onClick={() =>
                alert(
                  `Đã thêm ${quantity} sản phẩm ${data.productName} (Size: ${selectedSize}, Màu: ${selectedColor}) vào giỏ hàng!`
                )
              }
              className="flex-1 bg-white price border border-2  py-3 rounded-lg text-lg font-semibold hover:shadow-red-700 transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingCart size={20} />
              <span>THÊM VÀO GIỎ HÀNG</span>
            </button>
            <button
              onClick={() =>
                alert(
                  `Đã thêm ${quantity} sản phẩm ${data.productName} (Size: ${selectedSize}, Màu: ${selectedColor}) vào giỏ hàng!`
                )
              }
              className="flex-1 bg-red-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingCart size={20} />
              <span>THÊM VÀO GIỎ HÀNG</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. MÔ TẢ & THÀNH PHẦN KỸ THUẬT (Clone Accordion UI) */}
      <section className="mt-12 pt-8">
        <h2 className="font-sans text-black font-bold text-xl mb-6">
          MÔ TẢ SẢN PHẨM
        </h2>{" "}
        {/* */}
        <div className="border-b border-gray-300 mb-6">
          {/* Đường nét đứt - THÊM VÀO ĐÂY NẾU CẦN PHÂN CÁCH NGANG */}
        </div>
        {/* CONTAINER CHỨA ĐẶC ĐIỂM SẢN PHẨM */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => setIsDescOpen(!isDescOpen)}
            className="flex justify-between items-center w-full py-4 font-sans text-black font-bold  hover:bg-gray-50 transition-colors"
          >
            ĐẶC ĐIỂM SẢN PHẨM {/* */}
            <ChevronDown
              size={20}
              className={`transition-transform duration-300 ${isDescOpen ? "rotate-180" : "rotate-0"}`}
            />{" "}
            {/* */}
          </button>
          {isDescOpen && (
            <div className="p-4">
              <p className="text-gray-700 mb-4 font-medium">
                {data.productName} - Nền Tảng Ấm Cho Phong Cách Hiện Đại {/* */}
              </p>
              <p className="text-gray-700 mb-4">
                {data.shortDesc} {/* */}
              </p>
              {/* Banner ảnh giữa mô tả */}
              <img
                src={data.promoBanner}
                alt="WarmMax Extra Banner"
                className="w-full h-auto my-6"
              />{" "}
              {/* */}
              <button
                onClick={() => setIsFullDescExpanded(!isFullDescExpanded)}
                className="text-red-600 font-medium hover:text-red-700 flex items-center gap-1 transition-colors mt-4"
              >
                {isFullDescExpanded ? "Thu gọn" : "Xem thêm"} {/* */}
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${isFullDescExpanded ? "rotate-180" : "rotate-0"}`}
                />
              </button>
              {/* Nội dung đầy đủ (nếu mở rộng) */}
              {isFullDescExpanded && (
                <div className="mt-4 p-4 border-l-4 border-red-500 bg-gray-50 text-gray-700">
                  {/* Ở đây bạn sẽ render HTML đầy đủ của mô tả */}
                  <p>
                    Đây là nội dung mô tả chi tiết đầy đủ khi người dùng ấn "Xem
                    thêm".
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        {/* CONTAINER CHỨA THÀNH PHẦN, CHẤT LIỆU */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => setIsMaterialOpen(!isMaterialOpen)}
            className="flex justify-between items-center w-full py-4 font-sans text-black font-bold mb-6 hover:bg-gray-50 transition-colors"
          >
            THÀNH PHẦN, CHẤT LIỆU {/* */}
            <ChevronDown
              size={20}
              className={`transition-transform duration-300 ${isMaterialOpen ? "rotate-180" : "rotate-0"}`}
            />{" "}
            {/* */}
          </button>
          {isMaterialOpen && (
            <div className="p-4 border-t">
              <ul className="space-y-3">
                {data.materialComposition.map((item, index) => (
                  <li key={index}>
                    <span className="font-semibold text-gray-800">
                      {item.label}:
                    </span>
                    <span className="ml-2 text-gray-600">{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* 4. SẢN PHẨM LIÊN QUAN (Giữ nguyên cấu trúc) */}
      <section className="mt-20 pt-8 border-t">
        <h2 className="text-xl font-sans text-black font-bold mb-6">
          Sản Phẩm Liên Quan
        </h2>
        {/* ... Lưới sản phẩm liên quan ... */}
      </section>
    </main>
  );
}
