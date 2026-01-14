import React, { useState, useRef, useEffect } from "react";

// Danh sách các tùy chọn sắp xếp
const sortOptions = [
  { value: "default", label: "Mặc định" },
  { value: "price_asc", label: "Giá: Thấp → Cao" },
  { value: "price_desc", label: "Giá: Cao → Thấp" },
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "name_asc", label: "Tên: A → Z" },
  { value: "name_desc", label: "Tên: Z → A" },
];

// Component Icon Mũi tên xuống (thay thế HeroIcon)
const ChevronDownSvg = ({ isOpen }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
    />
  </svg>
);

export default function ProductsToolbar({ onSortChange, totalProducts = 5 }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("default");
  const dropdownRef = useRef(null);

  // Xử lý đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSelect = (value) => {
    setSelectedValue(value);
    onSortChange?.(value);
    setIsOpen(false);
  };

  const currentLabel = sortOptions.find(
    (opt) => opt.value === selectedValue
  )?.label;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-lg mb-6">
      {/* Left side - Sort label */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-700">
          Sắp xếp theo
        </span>
        {totalProducts > 0 && (
          <span className="text-xs text-gray-500">
            ({totalProducts} sản phẩm)
          </span>
        )}
      </div>

      {/* Right side - Custom Select Dropdown */}
      <div
        ref={dropdownRef}
        className="relative w-full sm:w-auto sm:min-w-[240px] z-10"
      >
        {/* 1. Button hiển thị giá trị hiện tại (Đã loại bỏ viền đen focus mặc định) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-black font-medium shadow-sm transition-all duration-200 
                                focus:outline-none  focus:ring-red-500 focus:ring-0 focus:border-red-500 cursor-pointer"
        >
          {currentLabel}

          {/* ICON SVG THAY THẾ CHO HEROICON */}
          <ChevronDownSvg isOpen={isOpen} />
        </button>

        {/* 2. Danh sách Options (Chỉ hiển thị khi isOpen = true) */}
        {isOpen && (
          <ul className="absolute top-full mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-xl py-1 max-h-60 overflow-y-auto">
            {sortOptions.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`
                                    px-4 py-2 text-sm cursor-pointer transition-colors duration-150
                                    ${
                                      option.value === selectedValue
                                        ? " text-white font font-semibold" // MÀU ĐỎ ĐẬM KHI ĐƯỢC CHỌN
                                        : "text-gray-900 hover:bg-red-100 hover:text-red-700" // MÀU ĐỎ NHẠT KHI HOVER
                                    }
                                `}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
