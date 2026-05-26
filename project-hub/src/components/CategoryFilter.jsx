import { Filter } from "lucide-react";

export default function CategoryFilter({ activeCategory, categories, sortBy, onCategoryChange, onSortChange }) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <span className="inline-flex h-9 items-center gap-2 text-sm font-bold text-slate-700">
          <Filter size={16} />
          หมวดหมู่
        </span>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
            className={`h-9 rounded-full border px-3 text-sm font-bold transition ${
              activeCategory === category
                ? "border-[#101a33] bg-[#101a33] text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <select
        value={sortBy}
        onChange={(event) => onSortChange(event.target.value)}
        className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none transition focus:border-slate-400"
      >
        <option value="newest">ใหม่ล่าสุด</option>
        <option value="title">เรียงตามชื่อ</option>
      </select>
    </div>
  );
}
