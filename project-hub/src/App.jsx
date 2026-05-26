import { useEffect, useState } from "react";
import { Database, Loader2, Plus, RotateCw } from "lucide-react";
import AppHeader from "./components/AppHeader";
import CategoryFilter from "./components/CategoryFilter";
import EmptyState from "./components/EmptyState";
import LinkCard from "./components/LinkCard";
import LinkFormModal from "./components/LinkFormModal";
import CommandPalette from "./components/CommandPalette";
import { useLinks } from "./hooks/useLinks";

export default function App() {
  const links = useLinks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Monitor keyboard Ctrl+K / Cmd+K to open Command Palette
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function openCreateModal() {
    links.startCreate();
    setIsModalOpen(true);
  }

  function openEditModal(link) {
    links.startEdit(link);
    setIsModalOpen(true);
  }

  function closeModal() {
    if (links.isSaving) return;
    links.resetForm();
    setIsModalOpen(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const saved = await links.saveLink();
    if (saved) setIsModalOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-950">
      <AppHeader query={links.query} onQueryChange={links.setQuery} onCreate={openCreateModal} />

      <main className="mx-auto max-w-6xl px-5 py-5 sm:px-6">
        <section className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-normal text-slate-950">จัดการลิงก์</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">แบ่งตามหมวดหมู่ ค้นหาเร็ว และแก้ไขรายการได้ง่าย</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 shadow-sm">
              <Database className={links.isSheetsConnected ? "text-emerald-600" : "text-orange-500"} size={16} />
              <span>{links.status}</span>
            </div>
            {links.isSheetsConfigured && (
              <button
                type="button"
                onClick={links.reload}
                disabled={links.isRefreshing || links.isLoading}
                title="ดึงข้อมูลล่าสุดจาก Google Sheets"
                aria-label="ดึงข้อมูลล่าสุดจาก Google Sheets"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RotateCw className={`h-4 w-4 ${links.isRefreshing ? "animate-spin" : ""}`} />
              </button>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <CategoryFilter
            activeCategory={links.activeCategory}
            categories={links.categories}
            sortBy={links.sortBy}
            onCategoryChange={links.setActiveCategory}
            onSortChange={links.setSortBy}
          />
        </section>

        <section className="mt-5">
          {links.isLoading ? (
            <div className="grid min-h-72 place-items-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <div>
                <Loader2 className="mx-auto animate-spin text-[#101a33]" size={28} />
                <h3 className="mt-4 text-base font-bold">กำลังโหลดข้อมูลจาก Google Sheets</h3>
              </div>
            </div>
          ) : links.filteredLinks.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {links.filteredLinks.map((link) => (
                <LinkCard
                  key={link.id}
                  copied={links.copiedId === link.id}
                  disabled={links.isSaving}
                  link={link}
                  onCopy={links.copyLink}
                  onEdit={openEditModal}
                  onRemove={links.removeLink}
                />
              ))}
            </div>
          ) : (
            <EmptyState onCreate={openCreateModal} isEmptyDatabase={!links.hasLinks} />
          )}
        </section>
      </main>

      <button
        type="button"
        onClick={openCreateModal}
        aria-label="เพิ่มลิงก์ใหม่"
        className="fixed bottom-5 right-5 z-30 grid h-13 w-13 place-items-center rounded-2xl bg-[#101a33] text-white shadow-xl shadow-slate-900/20 transition hover:bg-[#162442] sm:hidden"
      >
        <Plus size={23} />
      </button>

      {isModalOpen && (
        <LinkFormModal
          form={links.form}
          isEditing={Boolean(links.editingId)}
          isSaving={links.isSaving}
          categories={links.categories}
          onClose={closeModal}
          onSubmit={handleSubmit}
          onUpdate={links.updateForm}
        />
      )}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        links={links.filteredLinks}
      />
    </div>
  );
}
