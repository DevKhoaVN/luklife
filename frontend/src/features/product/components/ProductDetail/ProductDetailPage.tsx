import React, { useState, useMemo, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useGetProductBySlugQuery } from "../../productApi";
import { useParams, useLocation, Link } from "@tanstack/react-router";
import Gift from "../../../../../public/assets/gift.svg";
import ProductGallery from "./ProductGallery";
import ProductHeader from "./ProductHeader";
import PriceSection from "./PriceSection";
import ColorSelector from "./ColorSelector";
import QuantitySelector from "./QuantitySelector";
import AddToCartButtons from "./AddToCartButtons";
import DescriptionSection from "./DescriptionSection";
import VoucherList from "./VochuerList";
import SizeSelector from "./SizeSelector";

const MOCK_VOUCHERS = [
  { code: "NEWA26", discount: "300.000đ", minOrder: "399.000đ", icon: Gift },
  { code: "YEARA26", discount: "100.000đ", minOrder: "699.000đ", icon: Gift },
  { code: "HAPPY2026", discount: "126.000đ", minOrder: "999.000đ", icon: Gift },
  {
    code: "FREE_SHIP",
    discount: "Miễn phí vận chuyển 0đ",
    minOrder: "249.000đ",
    icon: Gift,
  },
];

function ProductDetailPage() {
  const { slug } = useParams({ from: "/san-pham/$slug" });
  const location = useLocation();
  const { data: response, isLoading, isError } = useGetProductBySlugQuery(slug);

  // State management
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [mainImage, setMainImage] = useState("");

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Đang tải sản phẩm...</div>
      </div>
    );
  }

  // if (isError || !response?.success || !response?.data?.data) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <div className="text-xl text-red-600">Không tìm thấy sản phẩm</div>
  //     </div>
  //   );
  // }

  const apiData = response.data;

  // Map API data to component format
  const mappedData = useMemo(() => {
    const currentPrice = parseFloat(apiData.price);
    const discountPercent = apiData.discount_percentage;
    const oldPrice = currentPrice / (1 - discountPercent / 100);

    // Extract unique colors and sizes from variants
    const colors = [
      ...new Set(apiData.product_variants.map((v: any) => v.color)),
    ].map((color) => ({
      name: color as string,
      hex: "#000000", // Default, map to actual colors if available
    }));

    const sizes = [
      ...new Set(apiData.product_variants.map((v: any) => v.size)),
    ];

    // Build thumbnails array
    const thumbnails = [
      apiData.thumbnail,
      ...apiData.product_variants
        .map((v: any) => v.image_url)
        .filter((url: string) => url && url !== ""),
    ];

    return {
      productId: apiData.id.toString(),
      productName: apiData.name,
      category: apiData.categories[0]?.name || "Chưa phân loại",
      sku: apiData.product_variants[0]?.sku || "N/A",
      rating: 5, // Mock - add to API later
      reviews: 1, // Mock
      sold: 288, // Mock
      currentPrice,
      oldPrice,
      discountPercent,
      colors,
      sizes,
      mainImage: apiData.thumbnail,
      thumbnails,
      shortDesc: apiData.description,
      variants: apiData.product_variants,
      vouchers: MOCK_VOUCHERS,
    };
  }, [apiData]);

  // Initialize selected values
  useEffect(() => {
    if (mappedData.colors.length > 0 && !selectedColor) {
      setSelectedColor(mappedData.colors[0].name);
    }
    if (mappedData.sizes.length > 0 && !selectedSize) {
      setSelectedSize(mappedData.sizes[0]);
    }
    if (mappedData.mainImage && !mainImage) {
      setMainImage(mappedData.mainImage);
    }
  }, [mappedData, selectedColor, selectedSize, mainImage]);

  // Find available stock for selected variant
  const availableStock = useMemo(() => {
    const variant = mappedData.variants.find(
      (v: any) => v.color === selectedColor && v.size === selectedSize
    );
    return variant?.stock_quantity || 0;
  }, [mappedData.variants, selectedColor, selectedSize]);

  // Breadcrumbs
  const breadcrumbs = [
    { name: "Trang chủ", path: "/" },
    {
      name: mappedData.category,
      path: `/danh-muc/${apiData.categories[0]?.slug}`,
    },
    { name: mappedData.productName, path: location.pathname },
  ];

  // Handlers
  const handleThumbnailClick = (src: string) => {
    setMainImage(src);
  };

  const handleQuantityChange = (type: "plus" | "minus") => {
    setQuantity((prev) => {
      const newQty = type === "plus" ? prev + 1 : prev - 1;
      return Math.max(1, Math.min(newQty, availableStock));
    });
  };

  const handleAddToCart = () => {
    alert(
      `Đã thêm ${quantity} sản phẩm ${mappedData.productName} (Size: ${selectedSize}, Màu: ${selectedColor}) vào giỏ hàng!`
    );
  };

  const handleBuyNow = () => {
    alert(
      `Mua ngay ${quantity} sản phẩm ${mappedData.productName} (Size: ${selectedSize}, Màu: ${selectedColor})!`
    );
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav
        className="flex items-center text-sm text-gray-500 mb-6"
        aria-label="Breadcrumb"
      >
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight size={14} className="mx-2" />}
            <Link
              to={crumb.path}
              className={`hover:text-red-600 transition-colors ${
                index === breadcrumbs.length - 1
                  ? "font-medium text-gray-800"
                  : "text-gray-500"
              }`}
            >
              {crumb.name}
            </Link>
          </React.Fragment>
        ))}
      </nav>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
        {/* Product Gallery */}
        <ProductGallery
          thumbnails={mappedData.thumbnails}
          mainImage={mainImage}
          onThumbnailClick={handleThumbnailClick}
        />

        {/* Product Info */}
        <div>
          <ProductHeader
            productName={mappedData.productName}
            sku={mappedData.sku}
            rating={mappedData.rating}
            reviews={mappedData.reviews}
            sold={mappedData.sold}
          />

          <PriceSection
            oldPrice={mappedData.oldPrice}
            currentPrice={mappedData.currentPrice}
            discountPercent={mappedData.discountPercent}
          />

          <div className="border-b border-dashed border-gray-500 mb-4 h-0 w-full"></div>

          <VoucherList vouchers={mappedData.vouchers} />

          <div className="border-b border-dashed border-gray-500 mb-4 h-0 w-full"></div>

          <ColorSelector
            colors={mappedData.colors}
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
          />

          <SizeSelector
            sizes={mappedData.sizes}
            selectedSize={selectedSize}
            onSizeSelect={setSelectedSize}
          />

          <QuantitySelector
            quantity={quantity}
            maxStock={availableStock}
            onQuantityChange={handleQuantityChange}
          />

          <AddToCartButtons
            productName={mappedData.productName}
            quantity={quantity}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        </div>
      </div>

      {/* Description Section */}
      <DescriptionSection
        productName={mappedData.productName}
        shortDesc={mappedData.shortDesc}
        promoBanner={mappedData.mainImage}
      />

      {/* Related Products */}
      <section className="mt-20 pt-8 border-t">
        <h2 className="text-xl font-sans text-black font-bold mb-6">
          Sản Phẩm Liên Quan
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Add related products component here */}
          <p className="text-gray-500 col-span-full text-center">
            Chưa có sản phẩm liên quan
          </p>
        </div>
      </section>
    </main>
  );
}

export default ProductDetailPage;
