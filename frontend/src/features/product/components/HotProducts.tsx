import React from "react";
import { ProductSection } from "./ProductSection";
import Load from "../../../components/common/Load";
import { useGetSaleProduct } from "../../../hooks/usePorduct";

const HotProducts = () => {
  const { data, isLoading, isError, error, refetch } = useGetSaleProduct(
    10,
    "hot"
  );

  if (isLoading) {
    return <Load />;
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-semibold mb-2">
            Không thể tải sản phẩm hot
          </p>
          <p className="text-red-500 text-sm mb-4">
            {error?.message || "Đã xảy ra lỗi khi tải dữ liệu"}
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

  const products = data?.data?.data || [];
  console.log("Hot products data:", products);

  // Kiểm tra nếu không có sản phẩm
  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Chưa có sản phẩm hot nào</p>
      </div>
    );
  }

  return (
    <ProductSection title="SẢN PHẨM HOT NHẤT MỖI NGÀY" products={products} />
  );
};

export default HotProducts;
