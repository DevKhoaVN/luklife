import React from "react";
// Đảm bảo Product type được import đúng với các trường:
// id, thumbnail, name, slugs, price (giá gốc), discount_percentage (số, ví dụ: 10, 20)
import type { Product } from "../type";
import { Link } from "@tanstack/react-router";

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  // Destructuring các trường dữ liệu cần thiết
  const {
    id,
    thumbnail,
    name,
    slug,
    price, // Giá gốc (giá chưa giảm)
    discount_percentage, // Phần trăm giảm giá (nếu có)
  } = product;

  const originalPrice = price || 0;

  // Tính toán giá đã giảm (giá bán)
  const isDiscounted = discount_percentage && discount_percentage > 0;
  const sellingPrice = isDiscounted
    ? originalPrice * (1 - (discount_percentage as number) / 100)
    : originalPrice;

  // Hàm định dạng tiền tệ (Ví dụ: 100000 -> 100.000₫)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    // Sử dụng slugs hoặc id để tạo liên kết sản phẩm
    <Link
      to={`/san-pham/${slug}`}
      className="flex-shrink-0  mx-1 md:mx-2 group block transition-shadow duration-300 hover:shadow-lg rounded-lg"
    >
      {/* 1. Container hình ảnh */}
      <div className="relative overflow-hidden bg-gray-100 aspect-[5/6] rounded-t-lg">
        <img
          src={thumbnail}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* 2. Hiển thị phần trăm giảm giá (Nếu có) */}
        {/* {isDiscounted && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-sm font-bold px-2 py-1 rounded">
            -{discount_percentage}%
          </div>
        )} */}
      </div>

      {/* 3. Thông tin sản phẩm & Giá */}
      <div className="text-left mt-3 p-1 pb-4 px-2">
        {/* Tên sản phẩm */}
        <p className="text-sm text-gray-800 line-clamp-2 font-medium ">
          {name}
        </p>

        {/* <p className="mt-2  text-sm font-bold text-red-600">
          {formatCurrency(sellingPrice)}
        </p> */}
        {/* Khối giá */}

        {isDiscounted ? (
          // Trường hợp có giảm giáư

          <>
            <p className="text-sm font-bold price my-1">
              {formatCurrency(originalPrice)}
            </p>
            <div className="mt-2 flex items-center justify-start ">
              {/* Giá bán (Giá đã giảm) */}
              <p className="text-sm normal text-gray-500 line-through ">
                {formatCurrency(originalPrice)}
              </p>
              {/* Giá gốc (Gạch ngang) */}
              <p className="text-sm font-bold text-red-600 ml-2">
                -{discount_percentage}%
              </p>
            </div>
            <p className="text-sm mt-1 normal text-gray-500 font-sans">
              giá cũ: {formatCurrency(originalPrice)}
            </p>
          </>
        ) : (
          // Trường hợp không giảm giá (Chỉ hiển thị giá gốc)
          <p className="text-sm font-bold price my-1">
            {formatCurrency(originalPrice)}
          </p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
