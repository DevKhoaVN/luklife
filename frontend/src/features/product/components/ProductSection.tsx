import React from "react";
import type { ProductSectionProps } from "../type";
import ProductCard from "../components/ProductCard";
import { Link } from "@tanstack/react-router";

export const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  products,
  isLoading = false,
  error = null,
}: ProductSectionProps) => {
  if (isLoading) return <div>Loading {title}...</div>;
  if (error)
    return (
      <div>
        Error loading {title}: {JSON.stringify(error)}
      </div>
    );
  if (!products || products.length === 0)
    return <div>No products in {title}</div>;

  return (
    <section className="product-section max-w-7xl mx-auto py-10 md:py-10">
      {/* Tiêu đề phần (MÀU ĐỎ) */}
      <div className="text-center mb-10">
        <h2 className="text-sm md:text-xl uppercase font-bold text-[#B92B27] tracking-wider relative inline-block">
          {title || "ĐƯỢC YÊU THÍCH NHẤT"}
          {/* Đường gạch dưới màu đỏ */}
          <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-8px] h-1 w-16 bg-[#B92B27]"></span>
        </h2>
      </div>

      {/* Danh sách sản phẩm - Sử dụng flexbox và overflow-x-auto để cuộn ngang */}
      <div className="grid grid-cols-5 gap-4 overflow-x-auto scrollbar-hide space-x-4 md:space-x-6 lg:space-x-8 px-4 pb-4">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
      {/* xem them btn */}
      <div className="text-center">
        <Link
          to={"/danh-muc-san-pham/$slug"}
          className="inline-block px-4 py-2  text-sm rounded mt-2 bg-red-800 text-white font-medium "
        >
          Xem tất cả sản phẩm
        </Link>
      </div>
    </section>
  );
};
