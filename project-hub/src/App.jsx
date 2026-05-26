import { useState } from "react";
import { Database, Loader2, Plus } from "lucide-react";
import AppHeader from "./components/AppHeader";
import CategoryFilter from "./components/CategoryFilter";
import EmptyState from "./components/EmptyState";
import LinkCard from "./components/LinkCard";
import LinkFormModal from "./components/LinkFormModal";
import { useLinks } from "./hooks/useLinks";
import { groupLinksByCategory } from "./utils/links";

export default function App() {
  const links = useLinks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const groupedLinks = groupLinksByCategory(links.filteredLinks);
  const categoryNames = Object.keys(groupedLinks);

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
          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 shadow-sm">
            <Database className={links.isSheetsConnected ? "text-emerald-600" : "text-orange-500"} size={16} />
            <span>{links.status}</span>
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
          ) : categoryNames.length > 0 ? (
            <div className="space-y-6">
              {categoryNames.map((category) => (
                <CategorySection
                  key={category}
                  category={category}
                  copiedId={links.copiedId}
                  disabled={links.isSaving}
                  links={groupedLinks[category]}
                  onCopy={links.copyLink}
                  onEdit={openEditModal}
                  onRemove={links.removeLink}
                />
              ))}
            </div>
          ) : (
            <EmptyState onCreate={openCreateModal} />
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
          onClose={closeModal}
          onSubmit={handleSubmit}
          onUpdate={links.updateForm}
        />
      )}
    </div>
  );
}

function CategorySection({ category, copiedId, disabled, links, onCopy, onEdit, onRemove }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-950">{category}</h3>
          <p className="text-sm font-medium text-slate-500">{links.length} รายการ</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {links.map((link) => (
          <LinkCard
            key={link.id}
            copied={copiedId === link.id}
            disabled={disabled}
            link={link}
            onCopy={onCopy}
            onEdit={onEdit}
            onRemove={onRemove}
          />
        ))}
      </div>
    </section>
  );
}
