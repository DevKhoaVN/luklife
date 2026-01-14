import React, { useState, useMemo, useEffect, useContext } from "react";
import { ChevronRight } from "lucide-react";
import {
  useParams,
  useLocation,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import ProductGallery from "./ProductGallery";
import ProductHeader from "./ProductHeader";
import PriceSection from "./PriceSection";
import ColorSelector from "./ColorSelector";
import QuantitySelector from "./QuantitySelector";
import AddToCartButtons from "./AddToCartButtons";
import DescriptionSection from "./DescriptionSection";
import VoucherList from "./VochuerList";
import SizeSelector from "./SizeSelector";
import { MOCK_VOUCHERS } from "../../../../constant";
import { useGetProductDetail } from "../../../../hooks/usePorduct";
import { useAddToCart } from "../../../../hooks/useCart";
import AppContext from "../../../../context/AppContext";
import { useQueryClient } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";

function ProductDetailPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { slug } = useParams({ from: "/san-pham/$slug" });
  const location = useLocation();
  const { cartItems, user } = useContext(AppContext);
  const { mutate: addToCartMutate, isPending: isAdding } = useAddToCart();

  // Fetch product detail
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGetProductDetail(slug);

  // State management
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [mainImage, setMainImage] = useState("");

  const apiData = response?.data;

  // Map API data to component format
  const mappedData = useMemo(() => {
    if (!apiData) return null;

    const currentPrice = parseFloat(apiData.price);
    const discountPercent = apiData.discount_percentage || 0;
    const oldPrice =
      discountPercent > 0 ? currentPrice / (1 - discountPercent / 100) : null;

    // Extract unique colors and sizes from variants
    const colors = [
      ...new Set(apiData.product_variants?.map((v) => v.color) || []),
    ].map((color) => ({
      name: color,
      hex: "#000000",
    }));

    const sizes = [
      ...new Set(apiData.product_variants?.map((v) => v.size) || []),
    ];

    // Build thumbnails array
    const thumbnails = [
      apiData.thumbnail,
      ...(apiData.product_variants
        ?.map((v) => v.image_url)
        .filter((url) => url && url !== "") || []),
    ];

    return {
      productId: apiData.id,
      productName: apiData.name,
      category: apiData.categories?.[0]?.name || "Chưa phân loại",
      sku: apiData.product_variants?.[0]?.sku || "N/A",
      rating: 5,
      reviews: 1,
      sold: 288,
      currentPrice,
      oldPrice,
      discountPercent,
      colors,
      sizes,
      mainImage: apiData.thumbnail,
      thumbnails,
      shortDesc: "",
      variants: apiData.product_variants || [],
      vouchers: MOCK_VOUCHERS,
    };
  }, [apiData]);

  // Initialize selected values
  useEffect(() => {
    if (!mappedData) return;

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

  // Find available stock
  const availableStock = useMemo(() => {
    if (!mappedData) return 0;

    const variant = mappedData.variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );
    return variant?.stock_quantity || 0;
  }, [mappedData, selectedColor, selectedSize]);

  // Breadcrumbs
  const breadcrumbs = useMemo(() => {
    if (!mappedData || !apiData) return [];

    return [
      { name: "Trang chủ", path: "/" },
      {
        name: mappedData.category,
        path: `/danh-muc/${apiData.categories?.[0]?.slug || ""}`,
      },
      { name: mappedData.productName, path: location.pathname },
    ];
  }, [mappedData, apiData, location.pathname]);

  // ✅ HANDLERS WITH COMPLETE ERROR HANDLING

  const handleThumbnailClick = (src) => {
    setMainImage(src);
  };

  const handleQuantityChange = (type) => {
    setQuantity((prev) => {
      const newQty = type === "plus" ? prev + 1 : prev - 1;
      return Math.max(1, Math.min(newQty, availableStock));
    });
  };

  const handleAddToCart = (e) => {
    // ✅ DEBUG LOGS
    console.log("🔴 handleAddToCart được gọi");
    console.log("User:", user);
    console.log("Selected size:", selectedSize);
    console.log("Selected color:", selectedColor);
    console.log("CartItems:", cartItems);
    console.log("MappedData:", mappedData);

    e.preventDefault();

    // ✅ KIỂM TRA USER
    if (!user) {
      console.log("❌ User chưa đăng nhập, chuyển hướng...");
      navigate({ to: "/auth/login" });
      return;
    }

    // ✅ KIỂM TRA SIZE VÀ COLOR
    if (!selectedSize || !selectedColor) {
      alert("Vui lòng chọn size và màu sắc!");
      console.log("❌ Chưa chọn size hoặc màu");
      return;
    }

    // ✅ KIỂM TRA MAPPEDDATA
    if (!mappedData || !mappedData.variants) {
      alert("Không thể tải thông tin sản phẩm!");
      console.log("❌ MappedData không hợp lệ");
      return;
    }

    // ✅ TÌM VARIANT
    const selectedVariant = mappedData.variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );

    console.log("Selected Variant:", selectedVariant);

    // ✅ KIỂM TRA VARIANT CÓ TỒN TẠI KHÔNG
    if (!selectedVariant) {
      alert("Không tìm thấy sản phẩm với size và màu đã chọn!");
      console.log("❌ Không tìm thấy variant phù hợp");
      return;
    }

    // ✅ KIỂM TRA CARTITEMS
    if (!cartItems || !cartItems.id) {
      alert("Không tìm thấy thông tin giỏ hàng! Vui lòng thử lại.");
      console.log("❌ CartItems không hợp lệ:", cartItems);
      return;
    }

    // ✅ KIỂM TRA STOCK
    if (selectedVariant.stock_quantity < quantity) {
      alert(`Chỉ còn ${selectedVariant.stock_quantity} sản phẩm trong kho!`);
      return;
    }

    // ✅ GỌI API ADD TO CART
    console.log("✅ Bắt đầu gọi API addToCart với data:", {
      variantId: selectedVariant.id,
      quantity: quantity,
      cartId: cartItems.id,
      price: mappedData.currentPrice,
    });

    addToCartMutate(
      {
        variantId: selectedVariant.id,
        quantity: quantity,
        cartId: cartItems.id,
        price: mappedData.currentPrice,
      },
      {
        onSuccess: (data) => {
          console.log("✅ Thêm vào giỏ hàng thành công:", data);
          queryClient.invalidateQueries({ queryKey: ["cart"] });

          // Reset quantity về 1 sau khi thêm thành công
          setQuantity(1);
        },
        onError: (error) => {
          console.error("❌ Lỗi khi thêm vào giỏ hàng:", error);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Không thể thêm vào giỏ hàng";
          alert("Lỗi: " + errorMessage);
        },
      }
    );
  };

  const handleBuyNow = (e) => {
    e.preventDefault();

    if (!user) {
      navigate({ to: "/auth/login" });
      return;
    }

    if (!selectedSize || !selectedColor) {
      alert("Vui lòng chọn size và màu sắc!");
      return;
    }

    const selectedVariant = mappedData.variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );

    if (!selectedVariant) {
      alert("Không tìm thấy sản phẩm với size và màu đã chọn!");
      return;
    }

    if (selectedVariant.stock_quantity < quantity) {
      alert(`Chỉ còn ${selectedVariant.stock_quantity} sản phẩm trong kho!`);
      return;
    }

    // Chuyển đến trang checkout với thông tin sản phẩm
    navigate({
      to: "/checkout",
      search: {
        variantId: selectedVariant.id,
        quantity: quantity,
      },
    });
  };

  // ✅ CONDITIONAL RENDERING

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        <span className="ml-3 text-xl text-gray-600">Đang tải sản phẩm...</span>
      </div>
    );
  }

  // Error state
  if (isError || !response?.success || !mappedData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-xl text-red-600 font-semibold mb-4">
          Không tìm thấy sản phẩm
        </div>
        <p className="text-gray-500 mb-6">
          {error?.message || "Sản phẩm không tồn tại hoặc đã bị xóa"}
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Về trang chủ
        </Link>
      </div>
    );
  }

  // ✅ MAIN RENDER

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

          {/* Stock Warning */}
          {availableStock === 0 && (
            <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
              <p className="text-red-600 text-sm font-medium">
                Sản phẩm này hiện đã hết hàng
              </p>
            </div>
          )}

          {/* Low Stock Warning */}
          {availableStock > 0 && availableStock <= 5 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
              <p className="text-yellow-700 text-sm font-medium">
                ⚠️ Chỉ còn {availableStock} sản phẩm trong kho
              </p>
            </div>
          )}

          <AddToCartButtons
            productName={mappedData.productName}
            quantity={quantity}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            disabled={availableStock === 0 || isAdding}
            isLoading={isAdding}
          />
        </div>
      </div>

      {/* Description Section */}
      <DescriptionSection
        productName={mappedData.productName}
        shortDesc={mappedData.shortDesc}
        promoBanner={mappedData.mainImage}
      />

      {/* Related Product */}
      <section className="mt-20 pt-8 border-t">
        <h2 className="text-xl font-sans text-black font-bold mb-6">
          Sản Phẩm Liên Quan
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <p className="text-gray-500 col-span-full text-center">
            Chưa có sản phẩm liên quan
          </p>
        </div>
      </section>
    </main>
  );
}

export default ProductDetailPage;
