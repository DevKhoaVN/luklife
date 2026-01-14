// src/components/WhiteListProduct.tsx
import { ProductSection } from "./ProductSection";
import Load from "../../../components/common/Load";
import { useGetWhiteListProduct } from "../../../hooks/usePorduct";

// Component Skeleton cho loading

const WhiteListProduct = () => {
  // Gọi API với limit = 10 và type = 'whitelist'
  const { data, isLoading, isError, error, refetch } = useGetWhiteListProduct(
    10,
    "whitelist"
  );

  // Loading state
  if (isLoading) {
    return <Load />;
  }

  // Error state
  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-semibold mb-2">
            Không thể tải sản phẩm yêu thích
          </p>
          <p className="text-red-500 text-sm mb-4">
            {error?.message || "Failed to load products"}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Lấy products từ response
  const products = data?.data?.data || [];
  console.log("Whitelist products data:", products);

  // Empty state
  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Chưa có sản phẩm yêu thích nào</p>
      </div>
    );
  }

  return <ProductSection title="SẢN PHẨM YÊU THÍCH NHẤT" products={products} />;
};

export default WhiteListProduct;
