import React, { useState } from "react";
import {
  Check,
  ChevronRight,
  ChevronDown,
  Folder,
  FileText,
} from "lucide-react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CategorySelector = ({ categories = [], selectedIds = [], onChange }) => {
  const [expandedIds, setExpandedIds] = useState(() => {
    const getAllParentIds = (items) => {
      let ids = [];
      items.forEach((item) => {
        if (item.children && item.children.length > 0) {
          ids.push(item.id);
          ids = [...ids, ...getAllParentIds(item.children)];
        }
      });
      return ids;
    };
    return getAllParentIds(categories);
  });

  const toggleExpand = (e, id) => {
    e.stopPropagation();
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelect = (id) => {
    const isSelected = selectedIds.includes(id);
    if (isSelected) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  // --- COMPONENT CON (Render từng dòng) ---
  const CategoryItem = ({ item, level }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedIds.includes(item.id);
    const isSelected = selectedIds.includes(item.id);

    return (
      <div className="w-full">
        <div
          className={cn(
            "flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-all border border-transparent select-none group",
            isSelected ? "bg-zinc-100 border-zinc-200" : "hover:bg-zinc-50"
          )}
          // Bỏ marginLeft ở đây vì ta đã dùng container bọc ở dưới để thụt lề rồi
          onClick={() => handleSelect(item.id)}
        >
          {/* Nút Mở/Đóng */}
          <div
            className={cn(
              "w-5 h-5 flex items-center justify-center rounded hover:bg-zinc-200 text-zinc-400 mr-1 transition-colors",
              !hasChildren && "opacity-0 cursor-default"
            )}
            onClick={(e) => hasChildren && toggleExpand(e, item.id)}
          >
            {hasChildren &&
              (isExpanded ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              ))}
          </div>

          {/* Custom Checkbox */}
          <div
            className={cn(
              "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all",
              isSelected
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-300 bg-white group-hover:border-zinc-400"
            )}
          >
            {isSelected && <Check size={10} strokeWidth={4} />}
          </div>

          {/* Icon phân cấp: Cấp 0 là Folder, còn lại là File */}
          <span className={cn("text-zinc-400", isSelected && "text-zinc-900")}>
            {level === 0 ? (
              <Folder size={14} fill={isSelected ? "currentColor" : "none"} />
            ) : (
              <FileText size={14} />
            )}
          </span>

          <span
            className={cn(
              "text-sm truncate transition-colors",
              level === 0
                ? "font-bold text-zinc-800"
                : "font-normal text-zinc-600",
              isSelected && "text-zinc-900 font-semibold"
            )}
          >
            {item.name}
          </span>
        </div>

        {/* PHẦN QUAN TRỌNG: Render Đệ quy cho cấp 2 và cấp 3 */}
        {hasChildren && isExpanded && (
          <div className="relative border-l border-zinc-200 ml-4 pl-1 mt-0.5 mb-1 transition-all">
            {item.children.map((child) => (
              <CategoryItem key={child.id} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // --- RETURN CHÍNH ---
  return (
    <div className="w-full border border-zinc-200 rounded-xl bg-white overflow-hidden shadow-sm">
      <div className="bg-zinc-50/80 px-4 py-3 border-b border-zinc-100 flex justify-between items-center">
        <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">
          Phân loại sản phẩm
        </label>
        <span className="text-[10px] bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded-full font-bold">
          {selectedIds.length} mục
        </span>
      </div>

      <div className="p-2 max-h-[400px] overflow-y-auto overflow-x-hidden custom-scrollbar">
        {categories.length > 0 ? (
          categories.map((category) => (
            <CategoryItem key={category.id} item={category} level={0} />
          ))
        ) : (
          <div className="py-10 text-center flex flex-col items-center justify-center">
            <Folder className="h-8 w-8 text-zinc-200 mb-2" />
            <p className="text-xs text-zinc-400">Chưa có danh mục nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySelector;
