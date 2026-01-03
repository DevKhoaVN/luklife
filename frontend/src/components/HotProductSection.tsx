import React, { useState } from "react";
import ProductCard from "./ProductCard";
// Import ProductCard đã tạo ở trên
import { ArrowRight } from "lucide-react";

const TABS = [
  { id: "combo", label: "COMBO TIẾT KIỆM" },
  { id: "online", label: "GIÁ ĐỘC QUYỀN ONLINE" },
  { id: "loved", label: "ĐƯỢC YÊU THÍCH NHẤT" },
];

const DUMMY_PRODUCTS = [
  // Sử dụng dữ liệu mẫu cho 5 sản phẩm đầu tiên
  {
    id: 1,
    image: "https://placehold.co/300x400/fff3e6/cc3300?text=PhaoNuVang",
    name: "Áo khoác phao nữ chần bông cổ",
    label: "MUA NHIỀU GIẢM SÂU",
    discountLabel: "VOUCHER GIẢM 200K",
  },
  {
    id: 2,
    image: "https://placehold.co/300x400/f0fff0/008000?text=LongCuuNam",
    name: "Áo khoác lông cừu nam cổ cao",
    label: "GIÁ TỐT",
  },
  {
    id: 3,
    image: "https://placehold.co/300x400/ffe0e6/ff3366?text=PhaoNuDo",
    name: "Áo khoác phao nữ siêu nhẹ cổ",
    label: "ĐỘC QUYỀN ONLINE",
  },
  {
    id: 4,
    image: "https://placehold.co/300x400/e6e6ff/3366cc?text=GileLongVu",
    name: "Áo khoác gile nữ lông vũ tự nhiên",
    label: "MUA LÀ CÓ QUÀ",
  },
  {
    id: 5,
    image: "https://placehold.co/300x400/e0ffff/009999?text=LongCuuNam",
    name: "Áo khoác lông cừu nam dáng",
    label: "HAPPY HOLIDAY",
  },
  // Thêm sản phẩm để section lớn hơn
  {
    id: 6,
    image: "https://placehold.co/300x400/e6ffe6/33cc33?text=AoThun",
    name: "Áo thun cơ bản cổ tròn",
    label: "GIÁ TỐT",
  },
  {
    id: 7,
    image: "https://placehold.co/300x400/fffff0/cccc00?text=QuanJean",
    name: "Quần jeans nữ Slimfit co giãn",
    label: "ĐỘC QUYỀN ONLINE",
  },
  {
    id: 8,
    image: "https://placehold.co/300x400/e6f0ff/3366ff?text=PhuKien",
    name: "Khẩu trang kháng khuẩn 5 lớp",
    label: "COMBO TIẾT KIỆM",
  },
];

const HotProductSection = () => {
  // Mặc định chọn tab "GIÁ ĐỘC QUYỀN ONLINE"
  const [activeTab, setActiveTab] = useState("online");

  // Lọc sản phẩm theo Tab đang chọn (Đây là logic giả lập)
  const filteredProducts = DUMMY_PRODUCTS;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      {/* --- 1. TIÊU ĐỀ SECTION --- */}
      <h2 className="text-center text-xl font-bold uppercase tracking-tight title-primary mb-6">
        DEAL GÌ CŨNG ĐẬM!
      </h2>

      {/* --- 2. THANH TAB ĐIỀU HƯỚNG --- */}
      <div className="flex justify-center border-b border-gray-200 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
                px-6 py-3 text-sm font-semibold  transition-colors duration-200
                ${
                  activeTab === tab.id
                    ? "text-red-600 border-b-4 border-red-600"
                    : "text-gray-500 hover:text-gray-700"
                }
              `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- 3. KHU VỰC HIỂN THỊ SẢN PHẨM --- */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* --- 4. NÚT XEM TẤT CẢ --- */}
      <div className="text-center mt-10">
        <button className="inline-flex items-center gap-2 px-4 py-2 border bg-[#C92027] rounded text-white font-bold text-sm">
          Xem tất cả sản phẩm
        </button>
      </div>
    </div>
  );
};

export default HotProductSection;
