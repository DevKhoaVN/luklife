import React from "react";
import { useGetOnlineExclusiveOfferQuery } from "../productApi";
import { ProductSection } from "./ProductSection";

const HotProducts = () => {
  const { data, isLoading, isError, error } = useGetOnlineExclusiveOfferQuery();

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
  return <ProductSection title="DEAL ONLINE ĐỘC QUYỀN" products={products} />;
};

export default HotProducts;
