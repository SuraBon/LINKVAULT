import { useState } from "react";
import { getHost, getInitials } from "../utils/links";

export default function LinkCard({ copied, disabled, link, onCopy, onEdit, onRemove }) {
  const [imgError, setImgError] = useState(false);
  const domain = getHost(link.url);
  const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;

  return (
    <article className="link-card">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 overflow-hidden text-xs font-extrabold text-[#101a33]">
          {!imgError ? (
            <img
              src={faviconUrl}
              alt=""
              onError={() => setImgError(true)}
              className="h-6 w-6 object-contain"
            />
          ) : (
            getInitials(link.title)
          )}
        </div>
        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-bold text-slate-950">{link.title}</h3>
            <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
              {link.category}
            </span>
          </div>
          <p className="mt-1 truncate text-sm font-bold text-emerald-700">{getHost(link.url)}</p>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{link.description}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <a href={link.url} target="_blank" rel="noreferrer" className="text-action text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50">
          เปิดเว็บ
        </a>
        <ActionButton disabled={disabled} onClick={() => onCopy(link)}>
          {copied ? "คัดลอกแล้ว" : "คัดลอก"}
        </ActionButton>
        <ActionButton disabled={disabled} onClick={() => onEdit(link)}>
          แก้ไข
        </ActionButton>
        <ActionButton
          danger
          disabled={disabled}
          onClick={() => {
            if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบลิงก์ "${link.title}"?`)) {
              onRemove(link.id);
            }
          }}
        >
          ลบ
        </ActionButton>
      </div>
    </article>
  );
}

function ActionButton({ children, danger = false, disabled = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`text-action disabled:cursor-not-allowed disabled:opacity-55 ${
        danger ? "text-red-600 hover:border-red-200 hover:bg-red-50" : "text-slate-600 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}
