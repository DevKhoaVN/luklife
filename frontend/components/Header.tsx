import React, { useState } from "react";
import logo from "../assets/header_logo.svg";
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="w-full bg-[#f9f3e8] shadow-sm relative z-40">
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
        </div>

        {/* NAVBAR (Desktop) */}
        <nav className="bg-white shadow-gray-300 hidden lg:block">
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex gap-8 h-12 items-center text-sm font-medium overflow-x-auto whitespace-nowrap">
              {MENU_CATEGORIES.map((link) => (
                <li
                  key={link.id}
                  className="hover:text-red-600 transition cursor-pointer"
                >
                  <span className={link.class || "text-gray-800"}>
                    {link.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

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
