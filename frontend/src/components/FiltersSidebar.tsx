import { useState, useEffect } from "react";

const HARDCODED_CATEGORIES = [
  { id: 1, name: "Giày thời trang", slug: "giay-thoi-trang" },
  { id: 2, name: "Dép bông", slug: "dep-bong" },
  { id: 3, name: "Giày thể thao", slug: "giay-the-thao" },
  { id: 4, name: "Giày nhựa", slug: "giay-nhua" },
  { id: 5, name: "Dép xỏ ngón", slug: "dep-xo-ngon" },
];

const HARDCODED_COLORS = [
  { name: "Trắng", hex: "#FFFFFF" },
  { name: "Đen", hex: "#000000" },
  { name: "Xanh lá", hex: "#008000" },
  { name: "Vàng", hex: "#FFFF00" },
  { name: "Hồng", hex: "#FFC0CB" },
  { name: "Tím", hex: "#800080" },
  { name: "Xám", hex: "#808080" },
  { name: "Cam", hex: "#FFA500" },
  { name: "Kem", hex: "#F5F5DC" },
  { name: "Xanh dương", hex: "#0000FF" },
  { name: "Nâu", hex: "#8B4513" },
];

function Section({ title, open, onToggle, children }) {
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left group"
      >
        <span className="text-md font-bold text-gray-900">{title}</span>
        <span className="text-gray-900 text-xl font-light">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}

export default function FiltersSidebar({ onFilterChange }) {
  const DEFAULT_PRICE = 1499000;
  const [priceMax, setPriceMax] = useState(DEFAULT_PRICE);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const [openColor, setOpenColor] = useState(true);
  const [openCategory, setOpenCategory] = useState(true);

  // Chỉ gửi filter lên khi các giá trị thực sự thay đổi
  // Riêng priceMax sẽ được xử lý qua onMouseUp để tránh gọi API quá nhiều
  useEffect(() => {
    onFilterChange?.({
      priceMax,
      category: selectedCategory,
      color: selectedColor,
    });
  }, [selectedCategory, selectedColor]); // Bỏ priceMax khỏi đây nếu dùng onMouseUp

  const handleReset = () => {
    setPriceMax(DEFAULT_PRICE);
    setSelectedCategory(null);
    setSelectedColor(null);
    onFilterChange?.({ priceMax: DEFAULT_PRICE, category: null, color: null });
  };

  const hasFilter =
    priceMax !== DEFAULT_PRICE ||
    selectedCategory !== null ||
    selectedColor !== null;

  return (
    <aside className="w-full pr-4">
      <div className="pb-6 mb-2 border-b border-gray-200">
        <h2 className="text-md font-bold text-gray-900 mb-6">Khoảng giá</h2>
        <div className="space-y-4 px-1">
          <input
            type="range"
            min={0}
            max={DEFAULT_PRICE}
            value={priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            // Chỉ gọi API khi người dùng dừng kéo
            onMouseUp={() =>
              onFilterChange?.({
                priceMax,
                category: selectedCategory,
                color: selectedColor,
              })
            }
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
            style={{
              background: `linear-gradient(to right, #e11d48 0%, #e11d48 ${(priceMax / DEFAULT_PRICE) * 100}%, #f3f4f6 ${(priceMax / DEFAULT_PRICE) * 100}%, #f3f4f6 100%)`,
            }}
          />
          <div className="flex justify-between text-sm font-medium text-gray-700">
            <span>0đ</span>
            <span>{priceMax.toLocaleString()}đ</span>
          </div>
        </div>
      </div>

      <Section
        title="Màu sắc"
        open={openColor}
        onToggle={() => setOpenColor(!openColor)}
      >
        <div className="grid grid-cols-6 gap-3">
          {HARDCODED_COLORS.map((color) => (
            <button
              key={color.name}
              type="button"
              onClick={() =>
                setSelectedColor(
                  selectedColor === color.name ? null : color.name
                )
              }
              className={`relative w-7 h-7 rounded-full border border-gray-200 transition-all ${
                selectedColor === color.name
                  ? "ring-2 ring-offset-2 ring-red-500 scale-110"
                  : "hover:scale-110"
              }`}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </Section>

      <Section
        title="Danh mục"
        open={openCategory}
        onToggle={() => setOpenCategory(!openCategory)}
      >
        <div className="space-y-4">
          {HARDCODED_CATEGORIES.map((cat) => (
            <label
              key={cat.slug}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                checked={selectedCategory === cat.slug}
                // Hỗ trợ click lần 2 để bỏ chọn
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === cat.slug ? null : cat.slug
                  )
                }
                onChange={() => {}}
                className="h-4 w-4 cursor-pointer accent-red-500"
              />
              <span
                className={`text-[14px] transition-all ${selectedCategory === cat.slug ? "text-black font-bold" : "text-gray-700 group-hover:text-black"}`}
              >
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </Section>

      {hasFilter && (
        <div className="mt-8">
          <button
            onClick={handleReset}
            className="w-full py-2 px-4 border border-red-600 text-red-600 text-sm font-semibold rounded-md hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
          >
            {/* Icon reset... */}
            Thiết lập lại
          </button>
        </div>
      )}
    </aside>
  );
}
