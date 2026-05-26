import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookmarkPlus,
  Check,
  Copy,
  ExternalLink,
  Filter,
  Globe2,
  Link2,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

const STORAGE_KEY = "link-vault-items";

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

function App() {
  const [links, setLinks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : seedLinks;
    } catch {
      return seedLinks;
    }
  });
  const [form, setForm] = useState({
    title: "",
    url: "",
    category: "",
    description: "",
  });
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ทั้งหมด");
  const [sortBy, setSortBy] = useState("newest");
  const [copiedId, setCopiedId] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  }, [links]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(links.map((item) => item.category).filter(Boolean)));
    return ["ทั้งหมด", ...unique];
  }, [links]);

  const filteredLinks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return links
      .filter((item) => {
        const matchesCategory = activeCategory === "ทั้งหมด" || item.category === activeCategory;
        const searchable = `${item.title} ${item.url} ${item.category} ${item.description}`.toLowerCase();
        return matchesCategory && searchable.includes(normalizedQuery);
      })
      .sort((a, b) => {
        if (sortBy === "title") return a.title.localeCompare(b.title, "th");
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [activeCategory, links, query, sortBy]);

  const stats = useMemo(() => {
    const categoryCount = new Set(links.map((item) => item.category).filter(Boolean)).size;
    return [
      { label: "ลิงก์ทั้งหมด", value: links.length },
      { label: "หมวดหมู่", value: categoryCount },
      { label: "ผลลัพธ์", value: filteredLinks.length },
    ];
  }, [filteredLinks.length, links]);

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const title = form.title.trim();
    const url = normalizeUrl(form.url);
    const category = form.category.trim() || "ทั่วไป";
    const description = form.description.trim();

    if (!title || !url || !description) return;

    setLinks((current) => [
      {
        id: crypto.randomUUID(),
        title,
        url,
        category,
        description,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
    setActiveCategory("ทั้งหมด");
    setForm({ title: "", url: "", category: "", description: "" });
  }

  function removeLink(id) {
    setLinks((current) => current.filter((item) => item.id !== id));
  }

  async function copyLink(item) {
    await navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    window.setTimeout(() => setCopiedId(""), 1500);
  }

  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-950 text-white">
              <Link2 size={20} strokeWidth={2.4} />
            </div>
            <div>
              <h1 className="text-xl font-semibold leading-tight tracking-normal">Link Vault</h1>
              <p className="text-sm text-zinc-500">เก็บเว็บสำคัญ ค้นหาเร็ว เปิดใช้ได้ทันที</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative min-w-0 sm:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-11 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm font-medium text-zinc-900 outline-none transition focus:border-teal-500 focus:bg-white"
                placeholder="ค้นหาชื่อเว็บ, URL, หมวดหมู่"
              />
            </label>
            <a
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
              href="https://vercel.com/new"
              target="_blank"
              rel="noreferrer"
            >
              Host Vercel
              <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-5 py-6 sm:px-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-8">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <form onSubmit={handleSubmit} className="rounded-lg border border-zinc-200 bg-zinc-50 p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">เพิ่มลิงก์ใหม่</h2>
                <p className="mt-1 text-sm text-zinc-500">บันทึกชื่อเว็บ ลิงก์ และคำอธิบายสั้น ๆ</p>
              </div>
              <BookmarkPlus className="text-teal-600" size={24} />
            </div>

            <div className="space-y-4">
              <Field label="ชื่อเว็บไซต์">
                <input
                  value={form.title}
                  onChange={(event) => updateForm("title", event.target.value)}
                  className="input-control"
                  placeholder="เช่น GitHub"
                  required
                />
              </Field>
              <Field label="URL">
                <input
                  value={form.url}
                  onChange={(event) => updateForm("url", event.target.value)}
                  className="input-control"
                  placeholder="github.com"
                  required
                />
              </Field>
              <Field label="หมวดหมู่">
                <input
                  value={form.category}
                  onChange={(event) => updateForm("category", event.target.value)}
                  className="input-control"
                  placeholder="Docs, Tools, Design"
                />
              </Field>
              <Field label="คำอธิบาย">
                <textarea
                  value={form.description}
                  onChange={(event) => updateForm("description", event.target.value)}
                  className="input-control min-h-28 resize-none"
                  placeholder="เว็บนี้ใช้ทำอะไร เหมาะกับงานแบบไหน"
                  required
                />
              </Field>
            </div>

            <button
              type="submit"
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              <Plus size={18} />
              เพิ่มเข้าคลังลิงก์
            </button>
          </form>
        </aside>

        <section className="min-w-0">
          <div className="grid gap-3 sm:grid-cols-3">
            {stats.map((item) => (
              <div key={item.label} className="rounded-lg border border-zinc-200 bg-white p-4">
                <p className="text-sm font-medium text-zinc-500">{item.label}</p>
                <p className="mt-2 text-3xl font-semibold tracking-normal text-zinc-950">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-4 border-b border-zinc-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="inline-flex h-9 items-center gap-2 text-sm font-semibold text-zinc-700">
                <Filter size={17} />
                กรอง
              </span>
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`h-9 rounded-lg border px-3 text-sm font-semibold transition ${
                    activeCategory === category
                      ? "border-teal-600 bg-teal-50 text-teal-700"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-700 outline-none transition focus:border-teal-500"
            >
              <option value="newest">ใหม่ล่าสุด</option>
              <option value="title">เรียงตามชื่อ</option>
            </select>
          </div>

          {filteredLinks.length > 0 ? (
            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              {filteredLinks.map((item) => (
                <article key={item.id} className="link-card">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-sm font-bold text-amber-800">
                      {getInitials(item.title) || <Globe2 size={20} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-base font-semibold text-zinc-950">{item.title}</h3>
                          <p className="mt-1 truncate text-sm font-medium text-zinc-500">{getHost(item.url)}</p>
                        </div>
                        <span className="shrink-0 rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-600">
                          {item.category}
                        </span>
                      </div>
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-600">{item.description}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
                    >
                      เปิดเว็บ
                      <ExternalLink size={16} />
                    </a>
                    <div className="flex items-center gap-2">
                      <IconButton label="คัดลอกลิงก์" onClick={() => copyLink(item)}>
                        {copiedId === item.id ? <Check size={17} /> : <Copy size={17} />}
                      </IconButton>
                      <IconButton label="ลบลิงก์" onClick={() => removeLink(item.id)} danger>
                        <Trash2 size={17} />
                      </IconButton>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5 flex min-h-80 items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-white text-zinc-500">
                  <Search size={22} />
                </div>
                <h3 className="mt-4 text-lg font-semibold">ไม่พบลิงก์ที่ตรงกับการค้นหา</h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                  ลองเปลี่ยนคำค้นหา เลือกหมวดหมู่อื่น หรือเพิ่มลิงก์ใหม่จากฟอร์มด้านซ้าย
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-zinc-700">{label}</span>
      {children}
    </label>
  );
}

function IconButton({ label, onClick, danger = false, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border text-sm transition ${
        danger
          ? "border-red-100 bg-red-50 text-red-600 hover:border-red-200 hover:bg-red-100"
          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
      }`}
    >
      {children}
    </button>
  );
}

export default App;
