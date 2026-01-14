import { useState, useEffect } from "react"; // Đừng quên import useState
import { useParams } from "@tanstack/react-router";
import { useInView } from "react-intersection-observer";
import FiltersSidebar from "../components/FiltersSidebar";
import ProductsToolbar from "../components/ProductToolBar";
import ProductGrid from "../components/ProductGrid";
import { Link } from "@tanstack/react-router";
import { House, ChevronRight } from "lucide-react";
import { useInfiniteProductsByCategory } from "../hooks/usePorduct";
import Load from "./common/Load";

export default function ProductsPage() {
  const { slug } = useParams({ from: "/danh-muc-san-pham/$slug" });

  // 1. Quản lý state cho Sort và Filter
  const [sort, setSort] = useState("newest");
  const [extraFilters, setExtraFilters] = useState({
    priceMax: 199000,
    child_category: null, // Single select
    color: null, // Single select
  });

  // 2. Truyền state vào Hook.
  // Hook này phải nhận các giá trị này trong queryKey để tự fetch lại khi chúng đổi.
  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteProductsByCategory({
    slug,
    sort,
    ...extraFilters, // Giải nén priceMax, category, color vào hook
  });

  const { ref, inView } = useInView({ threshold: 0.1 });

  // Tự động load thêm khi cuộn
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <Load />;

  // 3. Xử lý dữ liệu an toàn (Flatten mảng từ các trang API)
  const allProducts = data?.pages?.flatMap((page) => page.data.data) || [];

  // Ưu tiên lấy tên danh mục từ sản phẩm đầu tiên, nếu không có thì dùng slug
  const title =
    allProducts[0]?.categories?.[0]?.name || slug?.replace(/-/g, " ");

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-gray-500 mb-6">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link
                to="/"
                className="text-gray-700 hover:text-red-600 flex justify-center items-center"
              >
                <House size={16} className="mr-2" /> Trang chủ
              </Link>
            </li>
            <li>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </li>
            <li className="text-gray-700">Danh mục sản phẩm</li>
            <li>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </li>
            <li className="text-gray-800 font-bold capitalize">{title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Sidebar nhận hàm cập nhật Filter */}
          <aside className="lg:col-span-3">
            <FiltersSidebar
              onFilterChange={(newFilters) => setExtraFilters(newFilters)}
            />
          </aside>

          <main className="lg:col-span-9">
            <h1 className="text-lg font-semibold text-gray-600 mb-4 capitalize">
              {title} Luklife
            </h1>

            <div className="border-dashed border-b border-gray-300 mb-4"></div>

            {/* Toolbar nhận hàm cập nhật Sort */}
            <div className="mt-4">
              <ProductsToolbar
                totalProducts={allProducts.length}
                onSortChange={(value) => setSort(value)}
              />
            </div>

            <div className="mt-6">
              {status === "error" ? (
                <div className="text-center py-12 text-red-600">
                  Lỗi: {error?.message}
                </div>
              ) : allProducts.length === 0 ? (
                <div className="text-center py-12 text-gray-500 border rounded-lg">
                  Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
                </div>
              ) : (
                <>
                  <ProductGrid products={allProducts} />

                  {/* Trigger Infinite Scroll */}
                  <div
                    ref={ref}
                    className="py-10 text-center text-sm text-gray-500"
                  >
                    {isFetchingNextPage
                      ? "Đang tải thêm sản phẩm..."
                      : hasNextPage
                        ? "Cuộn xuống để tải thêm"
                        : "Đã hiển thị toàn bộ sản phẩm"}
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
