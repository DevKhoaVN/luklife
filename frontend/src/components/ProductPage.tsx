import FiltersSidebar from "../components/FiltersSidebar";
import ProductsToolbar from "../components/ProductToolBar";
import ProductGrid from "../components/ProductGrid";

const PRODUCTS = [
  {
    id: 1,
    title: "Dép nhựa siêu nhẹ chống trượt",
    badges: ["GIÁ TỐT", "ĐỘC QUYỀN ONLINE", "HAPPY HOLIDAY"],
    image:
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "Giày thể thao nam chạy bộ êm chân",
    badges: ["GIÁ TỐT", "ĐỘC QUYỀN ONLINE", "HAPPY HOLIDAY"],
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    title: "Giày thể thao nữ đế cao 6cm thời trang",
    badges: ["GIÁ TỐT", "ĐỘC QUYỀN ONLINE", "HAPPY HOLIDAY"],
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    title: "Giày thể thao nữ êm chân kháng khuẩn",
    badges: ["GIÁ TỐT", "ĐỘC QUYỀN ONLINE", "HAPPY HOLIDAY"],
    image:
      "https://images.unsplash.com/photo-1528701800489-20be9c37f2b1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    title: "Giày thể thao nữ đế cao 5.5cm",
    badges: ["GIÁ TỐT", "ĐỘC QUYỀN ONLINE", "HAPPY HOLIDAY"],
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <FiltersSidebar />
          </aside>

          <main className="lg:col-span-9">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Giày dép TokyoLife
            </h1>

            <div className="mt-4">
              <ProductsToolbar />
            </div>

            <div className="mt-6">
              <ProductGrid products={PRODUCTS} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
