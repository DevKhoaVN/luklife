import { ShoppingCart } from "lucide-react";

const AddToCartButtons = ({
  productName,
  quantity,
  selectedSize,
  selectedColor,
  onAddToCart,
  onBuyNow,
}: {
  productName: string;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  onAddToCart: () => void;
  onBuyNow: () => void;
}) => (
  <div className="flex justify-between items-center gap-4 mt-6">
    <button
      onClick={onAddToCart}
      className="flex-1 bg-white border-2 border-red-600 text-red-600 py-3 rounded-lg text-lg font-semibold hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
    >
      <ShoppingCart size={20} />
      <span>THÊM VÀO GIỎ HÀNG</span>
    </button>
    <button
      onClick={onBuyNow}
      className="flex-1 bg-red-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
    >
      <ShoppingCart size={20} />
      <span>MUA NGAY</span>
    </button>
  </div>
);

export default AddToCartButtons;
