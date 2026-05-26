import { Link2, Plus, Search } from "lucide-react";

export default function AppHeader({ query, onQueryChange, onCreate }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 shadow-sm shadow-slate-200/50 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#101a33] text-white shadow-sm">
            <Link2 size={18} strokeWidth={2.4} />
          </div>
          <div className="leading-none">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">LINKVAULT</p>
            <h1 className="mt-1 text-base font-bold tracking-normal text-slate-950">คลังลิงก์เว็บไซต์</h1>
          </div>
        </div>

        <nav className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onCreate}
            className="hidden h-10 items-center justify-center gap-2 rounded-xl bg-[#101a33] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#162442] sm:inline-flex"
          >
            <Plus size={17} />
            เพิ่มลิงก์
          </button>
          <label className="relative min-w-0 sm:w-72 flex items-center">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-14 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
              placeholder="ค้นหาชื่อเว็บ, URL, หมวดหมู่"
            />
            <kbd className="pointer-events-none absolute right-3 hidden rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] font-bold text-slate-400 shadow-sm sm:inline-block">
              Ctrl K
            </kbd>
          </label>
        </nav>
      </div>
    </header>
  );
}
