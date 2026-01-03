import { useMemo, useState } from "react";

/**
 * Component Section: Dùng để tạo các phần có thể mở/đóng (Accordion-like)
 * @param {string} title - Tiêu đề của phần
 * @param {boolean} open - Trạng thái mở/đóng
 * @param {function} onToggle - Hàm xử lý khi nhấn nút mở/đóng
 * @param {React.ReactNode} children - Nội dung bên trong phần
 */
function Section({ title, open, onToggle, children }) {
  return (
    <div className="border-b border-slate-200 py-4">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left"
      >
        {/* Tiêu đề */}
        <span className="text-sm font-semibold text-slate-900">{title}</span>
        {/* Biểu tượng mở/đóng */}
        <span className="text-slate-500">{open ? "–" : "+"}</span>
      </button>

      {/* Hiển thị nội dung nếu 'open' là true */}
      {open ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}

/**
 * Component FiltersSidebar: Sidebar lọc sản phẩm chính
 */
export default function FiltersSidebar() {
  // 1. State quản lý khoảng giá
  const [priceMin, setPriceMin] = useState(0); // Giá trị thấp nhất
  const [priceMax, setPriceMax] = useState(1199000); // Giá trị cao nhất/Max của thanh trượt

  // 2. State quản lý trạng thái mở/đóng của các Section
  const [openColor, setOpenColor] = useState(false);
  const [openCategory, setOpenCategory] = useState(true);

  // 3. useMemo: Tính toán chuỗi hiển thị khoảng giá (ví dụ: 0 - 1.199.000)
  const display = useMemo(() => {
    // Hàm format số theo định dạng tiền tệ Việt Nam
    const fmt = (n) => new Intl.NumberFormat("vi-VN").format(n);
    return `${fmt(priceMin)} - ${fmt(priceMax)}`;
  }, [priceMin, priceMax]); // Phụ thuộc vào priceMin và priceMax

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      {/* -------------------- PHẦN LỌC GIÁ -------------------- */}
      <div className="pb-4">
        <div className="text-[16px] font-semibold text-black">
          Sắp xếp khoảng giá
        </div>

        <div className="mt-4 space-y-3">
          {/* Thanh trượt Range Input */}
          <input
            type="range"
            min={0}
            max={1199000}
            // Mặc định, thanh trượt 1 chiều nên value thường là giá trị Max (priceMax)
            value={priceMin}
            // LƯU Ý LOGIC: Thanh trượt 1 chiều này đang cập nhật MIN (setPriceMin)
            // Nếu bạn muốn nó điều khiển giá trị MAX, hãy đổi thành setPriceMax
            onChange={(e) => setPriceMin(Number(e.target.value))}
            // Class custom, sử dụng màu đỏ (#C92127) cho thanh trượt
            className="w-full title-primary accent-[#C92127]"
          />

          {/* Hiển thị giá trị Min và Max */}
          <div className="flex items-center justify-between text-xs text-slate-600">
            {/* Hiển thị giá trị Min (đã được cập nhật từ thanh trượt) */}
            <span className="text-sm font-light">{priceMin}</span>
            {/* Hiển thị giá trị Max (cố định: 1199000) */}
            <span className="text-sm font-light">{priceMax}</span>
          </div>
        </div>
      </div>

      {/* -------------------- PHẦN LỌC MÀU SẮC -------------------- */}
      <Section
        title="Màu sắc"
        open={openColor}
        onToggle={() => setOpenColor((v) => !v)}
      >
        <div className="grid grid-cols-6 gap-2">
          {[
            "#111827", // Đen
            "#ffffff", // Trắng
            "#ef4444", // Đỏ (Red-500)
            "#22c55e", // Xanh lá (Green-500)
            "#3b82f6", // Xanh dương (Blue-500)
            "#f59e0b", // Vàng/Cam (Amber-500)
          ].map((c) => (
            <button
              key={c}
              type="button"
              className="h-7 w-7 rounded-full border border-slate-200 shadow-sm"
              style={{ background: c }}
              title={c}
            />
          ))}
        </div>
      </Section>

      {/* -------------------- PHẦN LỌC DANH MỤC -------------------- */}
      <Section
        title="Danh mục"
        open={openCategory}
        onToggle={() => setOpenCategory((v) => !v)}
      >
        <div className="space-y-3 text-sm text-slate-700">
          {[
            "Giày thể thao",
            "Dép bông",
            "Dép xỏ ngón",
            "Giày nhựa",
            "Dép nhựa",
          ].map((label) => (
            <label key={label} className="flex items-center gap-3">
              <input
                type="checkbox"
                // accent-rose-600: Đổi màu của checkbox thành hồng/đỏ
                className="h-4 w-4 rounded border-slate-300 accent-rose-600"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* -------------------- NÚT ÁP DỤNG -------------------- */}
      <div className="pt-4">
        <button
          type="button"
          className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          // Ở đây bạn sẽ thêm hàm onClick để xử lý lọc dữ liệu
        >
          Áp dụng
        </button>
      </div>
    </div>
  );
}
