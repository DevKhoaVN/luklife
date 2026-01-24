import React, { useState, useEffect, useContext, useRef } from "react";
import logo from "../../public/assets/luklife.png";

import {
  Search,
  PackageSearch,
  ShoppingCart,
  UserCircle,
  X,
  ChevronDown,
  LogIn,
  UserPlus,
  Loader2,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { MENU_CATEGORIES, slidesData } from "../constant";
import AppContext from "../context/AppContext";
import { useGetCart } from "../hooks/useCart";
import { useSearchProduct } from "../hooks/usePorduct";
import { useDebounce } from "../hooks/useDebounce";
import { formatPrice } from "../utils/inedx";

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
  const { user, setCartItems, cartItems } = useContext(AppContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const { data: cartData, isLoading } = useGetCart(user?.id);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);

  const { data: searchResults, isSearchLoading } =
    useSearchProduct(debouncedKeyword);

  const cartQuantity = cartData?.data?.items?.length || 0;
  const products = searchResults?.data?.data || [];
  console.log("san pham search ", products);

  useEffect(() => {
    if (cartData) setCartItems(cartData?.data);
  }, [cartData]);

  // 3. Xử lý click ra ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 4. Mở lại dropdown khi gõ hoặc có kết quả
  useEffect(() => {
    if (debouncedKeyword && products.length > 0) {
      setShowDropdown(true);
    }
  }, [debouncedKeyword, products.length]);

  const handleSearchSubmit = () => {
    setShowDropdown(false); // Đóng dropdown khi submit
    if (keyword.trim()) {
      navigate({ to: "/search", search: { q: keyword } });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearchSubmit();
  };
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="w-full relative z-[100]">
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
                <a href="/" className="text-xl sm:text-2xl text-gray-800">
                  <img
                    src={logo}
                    alt="Luklife Logo"
                    className="h-4 sm:h-7  ml-18 sm:ml-0"
                  />
                </a>
              </div>
            </div>

            {/* NHÓM 2: SEARCH (Ở giữa) - Sẽ giãn ra nhờ flex-1 */}
            <div
              className="flex-1 max-w-3xl hidden lg:block relative"
              ref={searchRef}
            >
              <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-red-200 transition-all">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                  className="flex-1 px-4 py-2 outline-none text-gray-700 placeholder-gray-400"
                  value={keyword}
                  onChange={(e) => {
                    setKeyword(e.target.value);
                    if (!e.target.value) setShowDropdown(false);
                  }}
                  onFocus={() => {
                    if (debouncedKeyword && products.length > 0)
                      setShowDropdown(true);
                  }}
                  onKeyDown={handleKeyDown}
                />

                {/* Nút Clear Text (Hiện khi có text) */}
                {keyword && (
                  <button
                    onClick={() => {
                      setKeyword("");
                      setShowDropdown(false);
                    }}
                    className="px-2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}

                <button
                  onClick={handleSearchSubmit}
                  className="bg-red-600 px-6 text-white hover:bg-red-700 transition duration-300 flex items-center justify-center"
                >
                  <Search size={20} />
                </button>
              </div>

              {/* --- DROPDOWN KẾT QUẢ --- */}
              {keyword && showDropdown && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                  {/* Trường hợp đang tải */}
                  {isSearchLoading ? (
                    <div className="p-6 text-center text-gray-500 flex flex-col items-center">
                      <Loader2 className="animate-spin mb-2 text-red-600" />
                      <span className="text-sm">Đang tìm kiếm...</span>
                    </div>
                  ) : products.length > 0 ? (
                    // Trường hợp CÓ kết quả
                    <div className="py-2">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Sản phẩm gợi ý
                      </div>

                      {/* List Products */}
                      <ul className="max-h-[320px] overflow-y-auto custom-scrollbar">
                        {products.slice(0, 5).map((product) => (
                          <li key={product.id}>
                            <Link
                              to={`/san-pham/${product.slug}`}
                              onClick={() => setShowDropdown(false)}
                              className="flex items-start gap-4 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                            >
                              <div className="w-12 h-12 flex-shrink-0 border border-gray-200 rounded-md overflow-hidden">
                                <img
                                  src={product.thumbnail || product.image} // Dùng field thumbnail từ API
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight mb-1">
                                  {product.name}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <span className="text-red-600 font-bold text-sm">
                                    {formatPrice(product.price)}
                                  </span>
                                  {product.discount_percentage > 0 && (
                                    <span className="text-xs text-white bg-red-500 px-1 rounded">
                                      -{product.discount_percentage}%
                                    </span>
                                  )}
                                </div>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>

                      {/* Footer: Xem tất cả */}
                      <div className="border-t border-gray-100 bg-gray-50 p-2 text-center">
                        <button
                          onClick={handleSearchSubmit}
                          className="text-sm text-red-600 font-medium hover:underline"
                        >
                          Xem tất cả {products.length} kết quả
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Trường hợp KHÔNG tìm thấy
                    <div className="p-8 text-center text-gray-500">
                      <Search className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      <p>Không tìm thấy sản phẩm nào cho "{keyword}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* NHÓM 3: ICONS (Bên phải) */}
            <div className="flex items-center gap-4">
              {/* Nút search mobile (nếu cần hiện lại thì bỏ comment) */}
              <button className="sm:hidden p-2 text-gray-600">
                <Search className="w-6 h-6" />
              </button>

              <Link
                to="/cart"
                className="relative p-2 text-gray-600 font-light"
              >
                <ShoppingCart className="w-7 h-7" />

                {/* Chỉ hiển thị chấm đỏ khi có sản phẩm và không trong trạng thái loading */}
                {!isLoading && cartQuantity > 0 && (
                  <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                    {cartQuantity > 99 ? "99+" : cartQuantity}
                  </span>
                )}

                {/* Hiển thị hiệu ứng pulse nhẹ nếu đang load dữ liệu (tùy chọn) */}
                {isLoading && (
                  <span className="absolute top-1 right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                )}
              </Link>

              <Link
                to="https://ghn.vn/blogs/trang-thai-don-hang"
                className="sm:hiddenp-2 text-gray-700 transition duration-150 group hidden sm:block"
              >
                <PackageSearch className="w-7 h-7" />
              </Link>
              {/* profile */}

              {user ? (
                <Link
                  to="/profile"
                  className="p-2 text-gray-700 transition duration-150 group  hidden sm:block"
                >
                  <UserCircle className="w-7 h-7" />
                </Link>
              ) : (
                <Link
                  to="/auth/login"
                  className="p-2 text-gray-700 transition duration-150 group hidden sm:block"
                >
                  <UserCircle className="w-7 h-7" />
                </Link>
              )}
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
            <ul className="flex items-center justify-center gap-8">
              {MENU_CATEGORIES.map((link) => (
                <li
                  key={link.id}
                  className="group py-4" // Padding dọc tạo độ thoáng cho thanh menu
                  onMouseEnter={() => setHoveredCategory(link.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <Link
                    to={`/danh-muc-san-pham/${link.slug}`}
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
                  </Link>
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
            <img src={logo} alt="Luklife Logo" className="h-4" />
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

        {/* Menu Category */}
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
