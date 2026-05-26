import { Search } from "lucide-react";

export default function EmptyState({ onCreate }) {
  return (
    <div className="grid min-h-72 place-items-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <div>
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-500">
          <Search size={22} />
        </div>
        <h3 className="mt-4 text-base font-bold">ไม่พบลิงก์ที่ตรงกับการค้นหา</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">ลองเปลี่ยนคำค้นหา เลือกหมวดหมู่อื่น หรือเพิ่มลิงก์ใหม่</p>
        <button type="button" onClick={onCreate} className="mt-4 rounded-xl bg-[#101a33] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#162442]">
          เพิ่มลิงก์
        </button>
      </div>
    </div>
  );
}
