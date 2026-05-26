import { useEffect, useRef, useState } from "react";
import { Search, Link2, CornerDownLeft } from "lucide-react";

export default function CommandPalette({ isOpen, onClose, links = [] }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Focus input when palette opens
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Filter links based on query
  const filtered = links.filter((link) => {
    const searchable = `${link.title} ${link.url} ${link.category} ${link.description}`.toLowerCase();
    return searchable.includes(query.trim().toLowerCase());
  }).slice(0, 8); // Show max 8 items for clean layout

  // Handle keyboard navigation inside palette
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (filtered.length > 0 ? (prev + 1) % filtered.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (filtered.length > 0 ? (prev - 1 + filtered.length) % filtered.length : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          window.open(filtered[selectedIndex].url, "_blank", "noopener,noreferrer");
          onClose();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  // Scroll selected item into view if necessary
  useEffect(() => {
    const activeEl = listRef.current?.children[selectedIndex];
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/40 p-4 pt-[15vh] backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="relative border-b border-slate-100 px-4 py-3 flex items-center">
          <Search className="text-slate-400 mr-3 shrink-0" size={20} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="ค้นหาด่วนและเปิดลิงก์..."
            className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Links list */}
        <div ref={listRef} className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((link, idx) => (
              <button
                key={link.id}
                type="button"
                onClick={() => {
                  window.open(link.url, "_blank", "noopener,noreferrer");
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-left transition ${
                  idx === selectedIndex ? "bg-slate-100 text-[#101a33]" : "text-slate-600"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                    idx === selectedIndex ? "bg-white text-[#101a33]" : "bg-slate-100 text-slate-500"
                  }`}>
                    <Link2 size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{link.title}</p>
                    <p className="text-[10px] font-medium text-slate-400 truncate mt-0.5">{link.url}</p>
                  </div>
                </div>

                {idx === selectedIndex && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm">
                    <CornerDownLeft size={10} />
                    <span>Enter</span>
                  </span>
                )}
              </button>
            ))
          ) : (
            <div className="py-8 text-center text-xs font-semibold text-slate-400">
              ไม่พบผลลัพธ์ที่ตรงกับการค้นหา
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="bg-slate-50 border-t border-slate-100 px-4 py-2 flex items-center justify-between text-[10px] font-bold text-slate-400">
          <div className="flex items-center gap-3">
            <span>↑↓ เพื่อเลื่อน</span>
            <span>Enter เพื่อเปิด</span>
          </div>
          <span>Esc เพื่อปิด</span>
        </div>
      </div>
    </div>
  );
}
