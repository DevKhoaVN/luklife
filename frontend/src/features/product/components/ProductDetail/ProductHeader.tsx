import { Star } from "lucide-react";

const ProductHeader = ({
  productName,
  sku,
  rating,
  reviews,
  sold,
}: {
  productName: string;
  sku: string;
  rating: number;
  reviews: number;
  sold: number;
}) => (
  <>
    <h1 className="text-2xl font-bold text-gray-800 mb-2">{productName}</h1>
    <p className="text-sm text-gray-600 mb-4">
      SKU: <span className="uppercase">{sku}</span>
    </p>
    <div className="flex items-center space-x-4 mb-6">
      <div className="flex items-center text-gray-500">
        {Array(rating)
          .fill(0)
          .map((_, i) => (
            <Star key={i} size={16} fill="black" strokeWidth={0} />
          ))}
        <span className="text-sm ml-2">5 sao</span>
      </div>
      <span className="text-sm text-gray-500 border-l pl-4">
        {reviews} đánh giá
      </span>
      <span className="text-sm text-gray-500 border-l pl-4">{sold} đã bán</span>
    </div>
  </>
);
export default ProductHeader;
