import React from "react";
import { useGetSaleProductQuery } from "../productApi";
import { ProductSection } from "./ProductSection";

const HotProducts = () => {
  const { data, isLoading, isError, error } = useGetSaleProductQuery();

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading products...</div>;
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center py-8">
        Error: {error?.message || "Failed to load products"}
      </div>
    );
  }

  const products = data?.data?.data || [];
  console.log("data ", products);
  return (
    <ProductSection title="SẢN PHẨM HOT NHẤT MỖI NGÀY" products={products} />
  );
};

export default HotProducts;
