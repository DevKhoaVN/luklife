import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="group flex flex-col p-2 bg-white rounded-lg transition-shadow duration-300 hover:shadow-lg">
      {/* 1. Phần Ảnh (Thường là link) */}
      <a
        href={`/product/${product.id}`}
        className="relative block overflow-hidden aspect-square"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {/* Nhãn nhỏ ở góc trên bên trái (nếu có) - Ví dụ: VOUCHER GIẢM 200K */}
        {product.discountLabel && (
          <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-bold py-1 px-2 rounded-br-lg uppercase">
            {product.discountLabel}
          </div>
        )}
      </a>

      {/* 2. Phần Thông tin */}
      <div className="mt-3 text-center">
        {/* Các nhãn nhỏ (GIÁ TỐT, HAPPY HOLIDAY) */}
        <div className="flex justify-center flex-wrap gap-x-1 gap-y-1 mb-2">
          {product.label.split(" ").map((word, index) => (
            <span
              key={index}
              className="bg-red-600 text-white text-[9px] font-bold px-1 py-[2px] uppercase rounded"
            >
              {word}
            </span>
          ))}
        </div>

        {/* Tên sản phẩm */}
        <h3 className="text-sm font-medium text-gray-700 h-10 overflow-hidden mb-1">
          <a
            href={`/product/${product.id}`}
            className="hover:text-red-600 transition"
          >
            {product.name}
          </a>
        </h3>

        {/* Giá sản phẩm (Dummy) */}
        <p className="text-base font-bold text-red-600">
          299.000₫
          <span className="text-xs font-normal text-gray-400 line-through ml-2">
            499.000₫
          </span>
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
