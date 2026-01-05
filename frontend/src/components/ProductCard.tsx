function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded bg-rose-600 px-2 py-1 text-[10px] font-semibold text-white">
      {children}
    </span>
  );
}

export default function ProductCard({ product }) {
  return (
    <div className="group rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] overflow-hidden rounded-t-xl bg-slate-50">
        <img
          src={product.Thu}
          alt={product.title}
          className="h-full w-full object-contain p-6 group-hover:scale-[1.02] transition-transform"
          loading="lazy"
        />
      </div>

      <div className="p-3">
        <div className="flex flex-wrap gap-2">
          {product.badges?.slice(0, 3).map((b) => (
            <Badge key={b}>{b}</Badge>
          ))}
        </div>

        <div className="mt-3 line-clamp-2 text-sm font-medium text-slate-900">
          {product.title}
        </div>
      </div>
    </div>
  );
}
