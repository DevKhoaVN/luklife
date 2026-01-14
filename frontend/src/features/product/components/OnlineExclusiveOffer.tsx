import Load from "../../../components/common/Load";
import { useGetOnlineExclusiveOffer } from "../../../hooks/usePorduct";
import { ProductSection } from "./ProductSection";

const OnlineExclusiveOffer = () => {
  // Gọi API với limit = 10 và type = 'deal'
  const { data, isLoading, isError, error, refetch } =
    useGetOnlineExclusiveOffer(10, "deal");

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
            Không thể tải sản phẩm deal online
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
  console.log("Online exclusive data:", products);

  // Empty state
  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Chưa có deal online nào</p>
      </div>
    );
  }

  return <ProductSection title="DEAL ONLINE ĐỘC QUYỀN" products={products} />;
};

export default OnlineExclusiveOffer;
