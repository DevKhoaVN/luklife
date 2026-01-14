import React from "react";
import { Trash2, Minus, Plus } from "lucide-react";

export default function CartItem({
  item,
  updateQuantity,
  removeItem,
  formatCurrency,
}) {
  return (
    <div className="flex flex-col p-6 sm:flex-row sm:items-center gap-6 group hover:bg-gray-50/50 transition-colors">
      {/* Ảnh sản phẩm */}
      <div className="relative h-32 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Thông tin chính */}
      <div className="flex flex-1 flex-col justify-between h-32">
        <div>
          <h3 className="text-base font-semibold text-gray-900 leading-tight">
            {item.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500 bg-gray-100 inline-block px-2 py-0.5 rounded text-xs mt-2">
            {item.variant}
          </p>
          <div className="my-2">
            <span className="block text-sm text-red-600 font-medium">
              {formatCurrency(item.price)}
            </span>
            <span className="text-xs text-gray-400 line-through">
              {formatCurrency(item.originalPrice)}
            </span>
          </div>

          {/* Desktop Input (Hiển thị khi màn hình lớn) */}
          <div className="hidden sm:flex w-23 items-center rounded border border-gray-300 bg-white">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-1 hover:bg-gray-100 text-gray-600 transition"
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="text"
              value={item.quantity}
              readOnly
              className="w-10 text-center text-sm font-semibold text-gray-900 focus:outline-none"
            />
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-1 hover:bg-gray-100 text-gray-600 transition"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Giá & Mobile actions */}
        <div className="mt-auto flex items-end justify-between sm:hidden">
          <div>
            <span className="block text-x text-blue font-extrabold">
              {formatCurrency(item.price)}
            </span>
            <span className="text-xs text-gray-400 line-through">
              {formatCurrency(item.originalPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Controls (Tổng tiền & Nút xóa bên phải) */}
      <div className="hidden sm:flex flex-col justify-between items-end h-32 w-48 py-1">
        <div>
          <button
            onClick={() => removeItem(item.id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
            title="Xóa sản phẩm"
          >
            <Trash2 className="h-5 w-5" color="red" />
          </button>
        </div>

        <div className="mt-2 text-sm font-medium text-gray-900">
          Tổng: {formatCurrency(item.price * item.quantity)}
        </div>
      </div>

      {/* Mobile Quantity Control (Hiện dưới cùng trên mobile) */}
      <div className="flex items-center justify-between border-t pt-4 sm:hidden">
        <div className="flex items-center rounded border border-gray-300">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="px-3 py-1"
          >
            -
          </button>
          <span className="px-2 font-medium">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="px-3 py-1"
          >
            +
          </button>
        </div>
        <button
          onClick={() => removeItem(item.id)}
          className="text-sm text-gray-500 underline"
        >
          Xóa
        </button>
      </div>
    </div>
  );
}
