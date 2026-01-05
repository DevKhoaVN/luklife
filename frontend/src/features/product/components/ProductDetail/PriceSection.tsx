const PriceSection = ({
  oldPrice,
  currentPrice,
  discountPercent,
}: {
  oldPrice: number;
  currentPrice: number;
  discountPercent: number;
}) => (
  <div className="mb-6">
    <p className="text-sm text-gray-500">
      Giá niêm yết cũ:{" "}
      <span className="line-through">{oldPrice.toLocaleString()}đ</span>
    </p>
    <div className="flex items-end space-x-4">
      <p className="text-3xl font-bold text-red-600">
        {currentPrice.toLocaleString()}đ
      </p>
      <p className="text-base font-semibold text-red-600">
        Giảm {discountPercent}% so với giá niêm yết cũ
      </p>
    </div>
  </div>
);

export default PriceSection;
