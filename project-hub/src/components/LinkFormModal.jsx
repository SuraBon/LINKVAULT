import { Loader2, X } from "lucide-react";

export default function LinkFormModal({ form, isEditing, isSaving, onClose, onSubmit, onUpdate }) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/35 px-4 py-4 backdrop-blur-sm sm:items-center">
      <form onSubmit={onSubmit} className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/15">
        <div className="flex items-start justify-between gap-4 bg-[#101a33] px-5 py-4 text-white">
          <div>
            <h2 className="text-base font-bold">{isEditing ? "แก้ไขรายการ" : "เพิ่มลิงก์ใหม่"}</h2>
            <p className="mt-1 text-xs font-medium text-slate-300">กรอกข้อมูลเว็บแล้วบันทึกเข้าคลังลิงก์</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="ปิดหน้าต่างเพิ่มลิงก์"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/10 text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={17} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <Field label="ชื่อเว็บไซต์">
            <input autoFocus value={form.title} onChange={(event) => onUpdate("title", event.target.value)} className="input-control" placeholder="เช่น GitHub" required />
          </Field>
          <Field label="URL">
            <input value={form.url} onChange={(event) => onUpdate("url", event.target.value)} className="input-control" placeholder="github.com" required />
          </Field>
          <Field label="หมวดหมู่">
            <input value={form.category} onChange={(event) => onUpdate("category", event.target.value)} className="input-control" placeholder="Docs, Tools, Design" />
          </Field>
          <Field label="คำอธิบาย">
            <textarea
              value={form.description}
              onChange={(event) => onUpdate("description", event.target.value)}
              className="input-control min-h-24 resize-none"
              placeholder="เว็บนี้ใช้ทำอะไร เหมาะกับงานแบบไหน"
              required
            />
          </Field>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 p-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#101a33] px-4 text-sm font-bold text-white transition hover:bg-[#162442] disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSaving ? <Loader2 className="animate-spin" size={17} /> : null}
            {isSaving ? "กำลังบันทึก" : isEditing ? "บันทึกการแก้ไข" : "บันทึกลิงก์"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-800">{label}</span>
      {children}
    </label>
  );
}
