export default function ProductsToolbar() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-slate-500">Sắp xếp theo</div>

      <div className="w-full sm:w-64">
        <select
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
          defaultValue="default"
        >
          <option value="default">Mặc định</option>
          <option value="price_asc">Giá: thấp → cao</option>
          <option value="price_desc">Giá: cao → thấp</option>
          <option value="new">Mới nhất</option>
        </select>
      </div>
    </div>
  );
}
