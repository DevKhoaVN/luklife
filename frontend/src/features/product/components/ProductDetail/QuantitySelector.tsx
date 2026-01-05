import { Minus, Plus } from "lucide-react";
const QuantitySelector = ({
  quantity,
  maxStock,
  onQuantityChange,
}: {
  quantity: number;
  maxStock: number;
  onQuantityChange: (type: "plus" | "minus") => void;
}) => (
  <div className="flex justify-between mt-6">
    <h2 className="text-md font-sans text-black font-bold mb-2">
      Chọn số lượng | <span className="text-gray-600">{quantity}</span>
    </h2>
    <div className="flex items-center space-x-6">
      <div className="flex items-center border border-gray-300 rounded-lg">
        <button
          onClick={() => onQuantityChange("minus")}
          disabled={quantity <= 1}
          className="p-2 text-gray-600 disabled:opacity-50 hover:bg-gray-100 rounded-l-lg"
        >
          <Minus size={18} />
        </button>
        <span className="px-4 text-lg font-medium select-none">{quantity}</span>
        <button
          onClick={() => onQuantityChange("plus")}
          disabled={quantity >= maxStock}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-lg disabled:opacity-50"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
    {maxStock < 10 && (
      <p className="text-sm text-red-600 mt-2">Chỉ còn {maxStock} sản phẩm</p>
    )}
  </div>
);

export default QuantitySelector;
