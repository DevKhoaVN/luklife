import React, { useState, useEffect } from "react";
import logo from "../../public/assets/header_logo.svg";

import {
  Search,
  PackageSearch,
  ShoppingCart,
  UserCircle,
  X,
  ChevronDown,
  LogIn,
  UserPlus,
} from "lucide-react";

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

// Dữ liệu menu với cấu trúc 3 cấp
const MENU_CATEGORIES = [
  {
    id: 1,
    label: "🔥 Sale",
    class: "text-red-600 font-semibold",
    children: [
      {
        id: 11,
        label: "Sale 50%",
        children: [
          { id: 111, label: "Áo thun" },
          { id: 112, label: "Quần jean" },
          { id: 113, label: "Giày dép" },
        ],
      },
      {
        id: 12,
        label: "Flash Sale",
        children: [
          { id: 121, label: "Đồ mùa đông" },
          { id: 122, label: "Phụ kiện" },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "Thời trang giữ ấm",
    children: [
      {
        id: 21,
        label: "Áo khoác",
        children: [
          { id: 211, label: "Áo khoác lông vũ" },
          { id: 212, label: "Áo khoác dạ" },
          { id: 213, label: "Áo khoác hoodie" },
        ],
      },
      {
        id: 22,
        label: "Áo len",
        children: [
          { id: 221, label: "Áo len cổ lọ" },
          { id: 222, label: "Áo len cardigan" },
        ],
      },
    ],
  },
  {
    id: 3,
    label: "Nữ",
    children: [
      {
        id: 31,
        label: "Áo",
        children: [
          { id: 311, label: "Áo thun" },
          { id: 312, label: "Áo sơ mi" },
          { id: 313, label: "Áo kiểu" },
        ],
      },
      {
        id: 32,
        label: "Quần",
        children: [
          { id: 321, label: "Quần jean" },
          { id: 322, label: "Quần tây" },
          { id: 323, label: "Quần short" },
        ],
      },
      {
        id: 33,
        label: "Váy",
        children: [
          { id: 331, label: "Váy ngắn" },
          { id: 332, label: "Váy midi" },
          { id: 333, label: "Váy maxi" },
        ],
      },
      {
        id: 31,
        label: "Áo",
        children: [
          { id: 311, label: "Áo thun" },
          { id: 312, label: "Áo sơ mi" },
          { id: 313, label: "Áo kiểu" },
        ],
      },
      {
        id: 31,
        label: "Áo",
        children: [
          { id: 311, label: "Áo thun" },
          { id: 312, label: "Áo sơ mi" },
          { id: 313, label: "Áo kiểu" },
        ],
      },
    ],
  },
  {
    id: 4,
    label: "Nam",
    children: [
      {
        id: 41,
        label: "Áo",
        children: [
          { id: 411, label: "Áo thun" },
          { id: 412, label: "Áo sơ mi" },
          { id: 413, label: "Áo polo" },
        ],
      },
      {
        id: 42,
        label: "Quần",
        children: [
          { id: 421, label: "Quần jean" },
          { id: 422, label: "Quần kaki" },
          { id: 423, label: "Quần short" },
        ],
      },
    ],
  },
  {
    id: 5,
    label: "Trẻ em",
    children: [
      {
        id: 51,
        label: "Bé gái",
        children: [
          { id: 511, label: "Áo bé gái" },
          { id: 512, label: "Váy bé gái" },
          { id: 513, label: "Quần bé gái" },
        ],
      },
      {
        id: 52,
        label: "Bé trai",
        children: [
          { id: 521, label: "Áo bé trai" },
          { id: 522, label: "Quần bé trai" },
        ],
      },
    ],
  },
  { id: 6, label: "Giày dép" },
  { id: 7, label: "Phụ kiện" },
  { id: 8, label: "Mỹ phẩm" },
  { id: 9, label: "Nhà cửa - Đời sống" },
  { id: 10, label: "Voucher" },
  { id: 11, label: "Tin tức" },
];

// Component cho từng item menu
const MenuItem = ({ item, level = 1, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Set isScrolled thành true nếu cuộn xuống quá 80px (hoặc chiều cao của Top Bar)
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    // Cleanup: Xóa listener khi component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const paddingLeft = level === 1 ? "pl-4" : level === 2 ? "pl-8" : "pl-12";

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) {
            setIsOpen(!isOpen);
          } else {
            onClose();
          }
        }}
        className={`w-full flex items-center justify-between ${paddingLeft} pr-4 py-3 hover:bg-gray-100 transition ${
          item.class || "text-gray-800"
        }`}
      >
        <span className={level === 1 ? "font-medium" : ""}>{item.label}</span>
        {hasChildren && (
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {hasChildren && isOpen && (
        <div className="bg-gray-50">
          {item.children.map((child) => (
            <MenuItem
              key={child.id}
              item={child}
              level={level + 1}
              onClose={onClose}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  // Dữ liệu mẫu
  const slidesData = [
    {
      id: 1,
      image_url:
        "https://s3-hni02.higiocloud.vn/gppm2/prod/cms/17667138083114784.jpg",
      alt: "Banner Thời trang Hè 2024",
    },
    {
      id: 2,
      image_url:
        "https://s3-hni02.higiocloud.vn/gppm2/prod/cms/17645741711879463.jpg",
      alt: "Banner Khuyến mãi lớn",
    },
  ];
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="w-full relative z-40">
        {/* TOP BAR */}
        <div className="bg-red-600 text-white text-[8px] sm:text-sm font-bold text-center py-2 px-4">
          GIỎ HÀNG TIẾT KIỆM ONLINE{" "}
          <a href="#" className="font-normal">
            &lt;&lt; MUA NGAY &gt;&gt;
          </a>
        </div>
        {/* MAIN HEADER */}
        <div className="max-w-7xl mx-auto px-4">
          {/* Thẻ cha này có justify-between */}
          <div className="flex items-center justify-between h-20 gap-6">
            {/* NHÓM 1: MENU & LOGO (Bên trái) */}
            <div className="flex items-center gap-2 sm:gap-1 flex-shrink-0">
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 text-gray-700 transition duration-150"
              >
                <MenuIcon />
              </button>

              <div className="font-extrabold tracking-tight min-w-max">
                <a href="#" className="text-xl sm:text-2xl text-gray-800">
                  <img
                    src={logo}
                    alt="Tokyolife Logo"
                    className="h-4 sm:h-7  ml-18 sm:ml-0"
                  />
                </a>
              </div>
            </div>

            {/* NHÓM 2: SEARCH (Ở giữa) - Sẽ giãn ra nhờ flex-1 */}
            <div className="flex-1 max-w-3xl hidden lg:block">
              <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-white">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                  className="flex-1 px-4 py-2 outline-none text-gray-700 placeholder-gray-400"
                />
                <button className="bg-red-600 px-4 text-white hover:bg-red-700 transition duration-300 flex items-center justify-center">
                  <Search />
                </button>
              </div>
            </div>

            {/* NHÓM 3: ICONS (Bên phải) */}
            <div className="flex items-center gap-4">
              {/* Nút search mobile (nếu cần hiện lại thì bỏ comment) */}
              <button className="sm:hidden p-2 text-gray-600">
                <Search className="w-6 h-6" />
              </button>

              <button className="relative p-2 text-gray-600 font-light">
                <ShoppingCart className="w-7 h-7" />
              </button>

              <button className="sm:hiddenp-2 text-gray-700 transition duration-150 group hidden sm:block">
                <PackageSearch className="w-7 h-7" />
              </button>

              <button className="p-2 text-gray-700 transition duration-150 group  hidden sm:block">
                <UserCircle className="w-7 h-7" />
              </button>
            </div>
          </div>

          <div></div>
        </div>
      </header>
      {/* NAVBAR (Desktop) */}
      <nav className="bg-white border-b border-gray-200 hidden lg:block relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Container phải là relative để menu con căn theo nó */}
          <div className="relative">
            <ul className="flex items-center gap-8">
              {MENU_CATEGORIES.map((link) => (
                <li
                  key={link.id}
                  className="group py-4" // Padding dọc tạo độ thoáng cho thanh menu
                  onMouseEnter={() => setHoveredCategory(link.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <a
                    href={`/category/${link.id}`}
                    className={`
                    flex items-center gap-1 text-black text-sm font-bold hover:text-[#C92027] tracking-wide  transition-colors duration-200
                  `}
                  >
                    {link.label}
                    {/* Hiển thị mũi tên nếu có menu con */}
                    {link.children && link.children.length > 0 && (
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          hoveredCategory === link.id ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </a>

                  {/* --- MEGA MENU START --- */}
                  {/* Logic: Hiển thị khi hover HOẶC khi đang hover vào chính menu con đó */}
                  {link.children && (
                    <div
                      className={`
                      absolute left-0 top-full w-full bg-white shadow-xl border-t border-gray-100 rounded-b-lg
                      transition-all duration-300 ease-in-out origin-top
                      ${
                        hoveredCategory === link.id
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible -translate-y-2"
                      }
                    `}
                    >
                      <div className="grid grid-cols-4 gap-8 p-8">
                        {link.children.map((level2) => (
                          <div
                            key={level2.id}
                            className="flex flex-col space-y-3"
                          >
                            {/* Level 2: Tiêu đề nhóm */}
                            <a
                              href={`/category/${level2.id}`}
                              className="text-base font-bold text-gray-900 hover:text-[#C92027] transition-colors border-b pb-2 mb-1 border-gray-100"
                            >
                              {level2.label}
                            </a>

                            {/* Level 3: Danh sách link chi tiết */}
                            {level2.children && level2.children.length > 0 && (
                              <ul className="space-y-4">
                                {level2.children.map((level3) => (
                                  <li key={level3.id}>
                                    <a
                                      href={`/category/${level3.id}`}
                                      className="text-sm font-medium text-gray-600 hover:text-[#C92027] hover:translate-x-1 transition-all duration-200 block"
                                    >
                                      {level3.label}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}

                        {/* Optional: Banner quảng cáo hoặc hình ảnh bên phải menu */}
                      </div>
                    </div>
                  )}
                  {/* --- MEGA MENU END --- */}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* MOBILE SIDEBAR MENU */}
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMobileMenu}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header Sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <img src={logo} alt="Tokyolife Logo" className="h-4" />
            <p className="text-[10px] font-stretch-expanded font-semibold text-gray-500 mt-1">
              Trải nghiệm đến từng phong cách sống.
            </p>
          </div>

          <button
            onClick={closeMobileMenu}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Account Section */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          {!isLoggedIn ? (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsLoggedIn(true);
                  // Thêm logic đăng nhập ở đây
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
              >
                <LogIn className="w-4 h-4" />
                <span className="font-medium">Đăng nhập</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-white text-red-600 border border-red-600 py-2 px-4 rounded-lg hover:bg-red-50 transition">
                <UserPlus className="w-4 h-4" />
                <span className="font-medium">Đăng ký</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <UserCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Xin chào!</p>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Menu Categories */}
        <div className="py-2">
          <h3 className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase">
            Danh mục
          </h3>
          {MENU_CATEGORIES.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              level={1}
              onClose={closeMobileMenu}
            />
          ))}
        </div>
      </div>
    </>
  );
}

// import React, { useState, useEffect } from "react";
// import { ChevronRight, Menu, ChevronDown } from "lucide-react";
//
// // DỮ LIỆU MẪU GIẢ LẬP (Cấu trúc 3 cấp + Hình ảnh banner)
// const CATEGORIES_DATA = [
//   {
//     id: "nu",
//     label: "Thời Trang Nữ",
//     banner: "https://placehold.co/300x400/fee2e2/dc2626?text=Sale+Nu+50%", // Ảnh giả lập
//     children: [
//       {
//         id: "nu-ao",
//         label: "Áo Nữ",
//         children: [
//           { id: "na1", label: "Áo Polo" },
//           { id: "na2", label: "Áo Chống Nắng" },
//           { id: "na3", label: "Áo Sơ Mi" },
//           { id: "na4", label: "Áo Thun" },
//         ],
//       },
//       {
//         id: "nu-quan",
//         label: "Quần & Chân Váy",
//         children: [
//           { id: "nq1", label: "Quần Jeans" },
//           { id: "nq2", label: "Chân Váy" },
//           { id: "nq3", label: "Quần Short" },
//         ],
//       },
//       {
//         id: "nu-phukien",
//         label: "Phụ Kiện Nữ",
//         children: [
//           { id: "np1", label: "Túi Xách" },
//           { id: "np2", label: "Giày Cao Gót" },
//         ],
//       },
//     ],
//   },
//   {
//     id: "nam",
//     label: "Thời Trang Nam",
//     banner: "https://placehold.co/300x400/e0f2fe/0284c7?text=Man+Collection",
//     children: [
//       {
//         id: "nam-ao",
//         label: "Áo Nam",
//         children: [
//           { id: "ma1", label: "Áo Polo" },
//           { id: "ma2", label: "Sơ Mi Nam" },
//           { id: "ma3", label: "Áo Vest" },
//         ],
//       },
//       {
//         id: "nam-quan",
//         label: "Quần Nam",
//         children: [
//           { id: "mq1", label: "Quần Âu" },
//           { id: "mq2", label: "Quần Kaki" },
//           { id: "mq3", label: "Quần Short" },
//         ],
//       },
//     ],
//   },
//   {
//     id: "giadung",
//     label: "Gia Dụng & Đời Sống",
//     banner: "https://placehold.co/300x400/f0fdf4/16a34a?text=Home+Decor",
//     children: [
//       {
//         id: "gd1",
//         label: "Phòng Khách",
//         children: [
//           { id: "pk1", label: "Sofa" },
//           { id: "pk2", label: "Đèn" },
//         ],
//       },
//       {
//         id: "gd2",
//         label: "Phòng Bếp",
//         children: [
//           { id: "pb1", label: "Nồi Chảo" },
//           { id: "pb2", label: "Bát Đĩa" },
//         ],
//       },
//     ],
//   },
//   { id: "mypham", label: "Mỹ Phẩm", children: [] }, // Ví dụ không có con
//   { id: "treem", label: "Trẻ Em", children: [] },
// ];
//
// const Header = () => {
//   // activeCategory: Lưu ID của danh mục Cấp 1 đang được hover ở cột trái
//   // Default lấy cái đầu tiên để cột phải không bị trống lúc mới mở
//   const [activeCategoryId, setActiveCategoryId] = useState(
//     CATEGORIES_DATA[0].id
//   );
//
//   // State để điều khiển việc hiển thị toàn bộ menu (khi hover vào chữ "Sản Phẩm")
//   const [isMenuVisible, setIsMenuVisible] = useState(false);
//
//   // Tìm data của danh mục đang active để hiển thị bên phải
//   const activeCategoryData = CATEGORIES_DATA.find(
//     (c) => c.id === activeCategoryId
//   );
//
//   return (
//     <nav className="bg-white border-b border-gray-200 relative">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex items-center h-16 gap-8">
//           {/* --- LOGO --- */}
//           <div className="text-2xl font-bold text-red-600 tracking-tighter">
//             TOKYOLIFE
//           </div>
//
//           {/* --- MAIN NAVIGATION --- */}
//           <ul className="flex gap-6 h-full items-center">
//             {/* MENU ITEM CÓ MEGA MENU (SẢN PHẨM) */}
//             <li
//               className="h-full flex items-center group"
//               onMouseEnter={() => setIsMenuVisible(true)}
//               onMouseLeave={() => setIsMenuVisible(false)}
//             >
//               <a
//                 href="/san-pham"
//                 className="flex items-center gap-1 font-bold text-gray-800 uppercase text-sm hover:text-red-600 cursor-pointer py-4"
//               >
//                 <Menu size={18} /> Danh mục sản phẩm <ChevronDown size={14} />
//               </a>
//
//               {/* --- MEGA MENU CONTAINER --- */}
//               {isMenuVisible && (
//                 <div className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 z-50 h-[450px]">
//                   <div className="max-w-7xl mx-auto h-full flex">
//                     {/* 1. CỘT TRÁI: DANH SÁCH CẤP 1 (SIDEBAR) */}
//                     <div className="w-64 border-r border-gray-100 h-full overflow-y-auto bg-gray-50/50">
//                       <ul className="py-2">
//                         {CATEGORIES_DATA.map((cat) => (
//                           <li
//                             key={cat.id}
//                             onMouseEnter={() => setActiveCategoryId(cat.id)} // Hover vào đâu, cột phải đổi theo đó
//                             className={`
//                               px-5 py-3 cursor-pointer flex justify-between items-center text-sm font-medium transition-all
//                               ${
//                                 activeCategoryId === cat.id
//                                   ? "bg-white text-red-600 border-l-4 border-red-600 shadow-sm"
//                                   : "text-gray-600 hover:bg-white hover:text-red-600"
//                               }
//                             `}
//                           >
//                             {cat.label}
//                             {/* Chỉ hiện mũi tên nếu đang active */}
//                             {activeCategoryId === cat.id && (
//                               <ChevronRight size={14} />
//                             )}
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//
//                     {/* 2. CỘT PHẢI: CHI TIẾT CẤP 2 & 3 + BANNER */}
//                     <div className="flex-1 p-8 h-full overflow-y-auto">
//                       {activeCategoryData && (
//                         <div className="flex gap-8">
//                           {/* Khu vực Grid Links */}
//                           <div className="flex-1 grid grid-cols-3 gap-y-8 gap-x-4 content-start">
//                             {activeCategoryData.children &&
//                             activeCategoryData.children.length > 0 ? (
//                               activeCategoryData.children.map((childL2) => (
//                                 <div key={childL2.id}>
//                                   {/* Cấp 2: Tiêu đề đậm */}
//                                   <a
//                                     href={`/c/${childL2.id}`}
//                                     className="block font-bold text-gray-900 text-sm mb-3 hover:text-red-600"
//                                   >
//                                     {childL2.label}
//                                   </a>
//                                   {/* Cấp 3: List nhỏ */}
//                                   <ul className="space-y-2">
//                                     {childL2.children?.map((childL3) => (
//                                       <li key={childL3.id}>
//                                         <a
//                                           href={`/c/${childL3.id}`}
//                                           className="text-sm text-gray-500 hover:text-red-600 hover:underline transition-all"
//                                         >
//                                           {childL3.label}
//                                         </a>
//                                       </li>
//                                     ))}
//                                   </ul>
//                                 </div>
//                               ))
//                             ) : (
//                               <div className="col-span-3 text-gray-400 italic">
//                                 Đang cập nhật danh mục...
//                               </div>
//                             )}
//                           </div>
//
//                           {/* Khu vực Banner Hình Ảnh (Bên phải cùng) */}
//                           <div className="w-64 shrink-0 hidden lg:block">
//                             {activeCategoryData.banner ? (
//                               <div className="relative group overflow-hidden rounded-lg h-full max-h-[350px]">
//                                 <img
//                                   src={activeCategoryData.banner}
//                                   alt={activeCategoryData.label}
//                                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//                                 />
//                                 <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
//                                 <div className="absolute bottom-4 left-4 right-4">
//                                   <button className="w-full bg-white/90 hover:bg-white text-gray-900 text-xs font-bold py-2 px-4 rounded shadow-lg transition-all">
//                                     Xem ngay
//                                   </button>
//                                 </div>
//                               </div>
//                             ) : (
//                               <div className="bg-gray-100 h-full rounded flex items-center justify-center text-gray-400 text-xs">
//                                 No Banner
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </li>
//
//             {/* CÁC MENU KHÁC (KHÔNG CÓ DROPDOWN) */}
//             <li>
//               <a
//                 href="#"
//                 className="font-semibold text-sm hover:text-red-600 transition"
//               >
//                 Tin tức
//               </a>
//             </li>
//             <li>
//               <a
//                 href="#"
//                 className="font-semibold text-sm hover:text-red-600 transition"
//               >
//                 Hệ thống cửa hàng
//               </a>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };
//
// export default Header;
