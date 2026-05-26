import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Copy,
  Database,
  ExternalLink,
  Filter,
  Folder,
  Link2,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

const STORAGE_KEY = "link-vault-items";
const SHEETS_API_URL = import.meta.env.VITE_SHEETS_WEB_APP_URL?.trim() || "";
const ALL_CATEGORY = "ทั้งหมด";

const seedLinks = [
  {
    id: "seed-1",
    title: "Vercel Dashboard",
    url: "https://vercel.com/dashboard",
    category: "Deploy",
    description: "จัดการโปรเจกต์ frontend, domains, environment variables และ production deploy",
    createdAt: "2026-05-20T10:00:00.000Z",
  },
  {
    id: "seed-2",
    title: "React Docs",
    url: "https://react.dev",
    category: "Docs",
    description: "เอกสาร React สำหรับ component, hooks และแนวทางสร้าง UI แบบทันสมัย",
    createdAt: "2026-05-18T10:00:00.000Z",
  },
  {
    id: "seed-3",
    title: "Tailwind CSS",
    url: "https://tailwindcss.com",
    category: "Design",
    description: "utility CSS สำหรับจัด layout, spacing, color และ responsive design",
    createdAt: "2026-05-16T10:00:00.000Z",
  },
];

async function sheetsRequest(payload) {
  const response = await fetch(SHEETS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok || data.ok === false) {
    throw new Error(data.error || "Google Sheets request failed");
  }
  return data;
}

function normalizeUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function getHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function getInitials(title) {
  return title
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function loadLocalLinks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : seedLinks;
  } catch {
    return seedLinks;
  }
}

function App() {
  const [links, setLinks] = useState(loadLocalLinks);
  const [form, setForm] = useState({ title: "", url: "", category: "", description: "" });
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  const [sortBy, setSortBy] = useState("newest");
  const [copiedId, setCopiedId] = useState("");
  const [status, setStatus] = useState(SHEETS_API_URL ? "กำลังโหลดจาก Google Sheets..." : "ยังไม่ได้เชื่อม Google Sheets");
  const [isLoading, setIsLoading] = useState(Boolean(SHEETS_API_URL));
  const [isSaving, setIsSaving] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const isSheetsConnected = Boolean(SHEETS_API_URL);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  }, [links]);

  useEffect(() => {
    if (!SHEETS_API_URL) return;

    let active = true;
    async function loadFromSheets() {
      try {
        setIsLoading(true);
        const data = await sheetsRequest({ action: "list" });
        if (!active) return;
        setLinks(data.links || []);
        setStatus("เชื่อม Google Sheets แล้ว");
      } catch (error) {
        if (!active) return;
        setStatus(`โหลดจาก Google Sheets ไม่สำเร็จ: ${error.message}`);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadFromSheets();
    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(links.map((item) => item.category).filter(Boolean)));
    return [ALL_CATEGORY, ...unique];
  }, [links]);

  const filteredLinks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return links
      .filter((item) => {
        const matchesCategory = activeCategory === ALL_CATEGORY || item.category === activeCategory;
        const searchable = `${item.title} ${item.url} ${item.category} ${item.description}`.toLowerCase();
        return matchesCategory && searchable.includes(normalizedQuery);
      })
      .sort((a, b) => {
        if (sortBy === "title") return a.title.localeCompare(b.title, "th");
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [activeCategory, links, query, sortBy]);

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function closeAddModal() {
    if (!isSaving) setIsAddOpen(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const title = form.title.trim();
    const url = normalizeUrl(form.url);
    const category = form.category.trim() || "ทั่วไป";
    const description = form.description.trim();
    if (!title || !url || !description) return;

    const newLink = {
      id: crypto.randomUUID(),
      title,
      url,
      category,
      description,
      createdAt: new Date().toISOString(),
    };

    try {
      setIsSaving(true);
      if (SHEETS_API_URL) {
        const data = await sheetsRequest({ action: "create", link: newLink });
        setLinks((current) => [data.link || newLink, ...current]);
        setStatus("บันทึกลง Google Sheets แล้ว");
      } else {
        setLinks((current) => [newLink, ...current]);
        setStatus("บันทึกในเครื่อง เพราะยังไม่ได้เชื่อม Google Sheets");
      }
      setActiveCategory(ALL_CATEGORY);
      setForm({ title: "", url: "", category: "", description: "" });
      setIsAddOpen(false);
    } catch (error) {
      setStatus(`บันทึกไม่สำเร็จ: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  }

  async function removeLink(id) {
    try {
      setIsSaving(true);
      if (SHEETS_API_URL) {
        await sheetsRequest({ action: "delete", id });
        setStatus("ลบจาก Google Sheets แล้ว");
      } else {
        setStatus("ลบจากข้อมูลในเครื่องแล้ว");
      }
      setLinks((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      setStatus(`ลบไม่สำเร็จ: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  }

  async function copyLink(item) {
    await navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    window.setTimeout(() => setCopiedId(""), 1500);
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-950">
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
              onClick={() => setIsAddOpen(true)}
              className="hidden h-10 items-center justify-center gap-2 rounded-xl bg-[#101a33] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#162442] sm:inline-flex"
            >
              <Plus size={17} />
              เพิ่มลิงก์
            </button>
            <label className="relative min-w-0 sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                placeholder="ค้นหาชื่อเว็บ, URL, หมวดหมู่"
              />
            </label>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-5 sm:px-6">
        <section className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-normal text-slate-950">จัดการลิงก์</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">บันทึกเว็บสำคัญ ค้นหาเร็ว และเปิดใช้งานได้ทันที</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 shadow-sm">
            <Database className={isSheetsConnected ? "text-emerald-600" : "text-orange-500"} size={16} />
            <span>{status}</span>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="inline-flex h-9 items-center gap-2 text-sm font-bold text-slate-700">
                <Filter size={16} />
                กรอง
              </span>
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
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
              onChange={(event) => setSortBy(event.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none transition focus:border-slate-400"
            >
              <option value="newest">ใหม่ล่าสุด</option>
              <option value="title">เรียงตามชื่อ</option>
            </select>
          </div>

          {isLoading ? (
            <div className="grid min-h-72 place-items-center p-8 text-center">
              <div>
                <Loader2 className="mx-auto animate-spin text-[#101a33]" size={28} />
                <h3 className="mt-4 text-base font-bold">กำลังโหลดข้อมูลจาก Google Sheets</h3>
              </div>
            </div>
          ) : filteredLinks.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {filteredLinks.map((item) => (
                <article key={item.id} className="link-row">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-xs font-extrabold text-[#101a33]">
                      {getInitials(item.title) || <Folder size={18} />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <h3 className="truncate text-sm font-bold text-slate-950">{item.title}</h3>
                        <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
                          {item.category}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-sm font-bold text-emerald-700">{getHost(item.url)}</p>
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{item.description}</p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="เปิดเว็บ"
                      title="เปิดเว็บ"
                      className="icon-action text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50"
                    >
                      <ExternalLink size={17} />
                    </a>
                    <IconButton label="คัดลอกลิงก์" onClick={() => copyLink(item)} disabled={isSaving}>
                      {copiedId === item.id ? <Check size={17} /> : <Copy size={17} />}
                    </IconButton>
                    <IconButton label="ลบลิงก์" onClick={() => removeLink(item.id)} danger disabled={isSaving}>
                      <Trash2 size={17} />
                    </IconButton>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="grid min-h-72 place-items-center p-8 text-center">
              <div>
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-500">
                  <Search size={22} />
                </div>
                <h3 className="mt-4 text-base font-bold">ไม่พบลิงก์ที่ตรงกับการค้นหา</h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">ลองเปลี่ยนคำค้นหา เลือกหมวดหมู่อื่น หรือเพิ่มลิงก์ใหม่จากปุ่มด้านบน</p>
              </div>
            </div>
          )}
        </section>
      </main>

      <button
        type="button"
        onClick={() => setIsAddOpen(true)}
        aria-label="เพิ่มลิงก์ใหม่"
        className="fixed bottom-5 right-5 z-30 grid h-13 w-13 place-items-center rounded-2xl bg-[#101a33] text-white shadow-xl shadow-slate-900/20 transition hover:bg-[#162442] sm:hidden"
      >
        <Plus size={23} />
      </button>

      {isAddOpen && (
        <AddLinkModal form={form} isSaving={isSaving} onClose={closeAddModal} onSubmit={handleSubmit} onUpdate={updateForm} />
      )}
    </div>
  );
}

function AddLinkModal({ form, isSaving, onClose, onSubmit, onUpdate }) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/35 px-4 py-4 backdrop-blur-sm sm:items-center">
      <form onSubmit={onSubmit} className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/15">
        <div className="flex items-start justify-between gap-4 bg-[#101a33] px-5 py-4 text-white">
          <div>
            <h2 className="text-base font-bold">เพิ่มลิงก์ใหม่</h2>
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
            {isSaving ? <Loader2 className="animate-spin" size={17} /> : <Plus size={17} />}
            {isSaving ? "กำลังบันทึก" : "บันทึกลิงก์"}
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

function IconButton({ label, onClick, danger = false, disabled = false, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`icon-action disabled:cursor-not-allowed disabled:opacity-55 ${
        danger ? "text-red-600 hover:border-red-200 hover:bg-red-50" : "text-slate-600 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

export default App;
