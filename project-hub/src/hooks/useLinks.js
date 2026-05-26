import { useEffect, useMemo, useState } from "react";
import { sheetsRequest } from "../api/sheetsClient";
import { ALL_CATEGORY, emptyLinkForm, SHEETS_API_URL } from "../constants/links";
import { loadLocalLinks, normalizeUrl, saveLocalLinks, sortLinks } from "../utils/links";

export function useLinks() {
  const [links, setLinks] = useState(loadLocalLinks);
  const [form, setForm] = useState(emptyLinkForm);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  const [sortBy, setSortBy] = useState("newest");
  const [copiedId, setCopiedId] = useState("");
  const [status, setStatus] = useState(SHEETS_API_URL ? "กำลังโหลดจาก Google Sheets..." : "ยังไม่ได้เชื่อม Google Sheets");
  const [isLoading, setIsLoading] = useState(Boolean(SHEETS_API_URL));
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState("");

  useEffect(() => {
    saveLocalLinks(links);
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
    const filtered = links.filter((item) => {
      const matchesCategory = activeCategory === ALL_CATEGORY || item.category === activeCategory;
      const searchable = `${item.title} ${item.url} ${item.category} ${item.description}`.toLowerCase();
      return matchesCategory && searchable.includes(normalizedQuery);
    });

    return sortLinks(filtered, sortBy);
  }, [activeCategory, links, query, sortBy]);

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setEditingId("");
    setForm(emptyLinkForm);
  }

  function startCreate() {
    resetForm();
  }

  function startEdit(item) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      url: item.url,
      category: item.category,
      description: item.description,
    });
  }

  async function saveLink() {
    const title = form.title.trim();
    const url = normalizeUrl(form.url);
    const category = form.category.trim() || "ทั่วไป";
    const description = form.description.trim();
    if (!title || !url || !description) return false;

    const savedLink = {
      id: editingId || crypto.randomUUID(),
      title,
      url,
      category,
      description,
      createdAt: links.find((item) => item.id === editingId)?.createdAt || new Date().toISOString(),
    };

    try {
      setIsSaving(true);
      if (SHEETS_API_URL) {
        const data = await sheetsRequest({
          action: editingId ? "update" : "create",
          link: savedLink,
        });
        setLinks((current) => upsertLink(current, data.link || savedLink, editingId));
        setStatus(editingId ? "แก้ไขรายการใน Google Sheets แล้ว" : "บันทึกลง Google Sheets แล้ว");
      } else {
        setLinks((current) => upsertLink(current, savedLink, editingId));
        setStatus(editingId ? "แก้ไขข้อมูลในเครื่องแล้ว" : "บันทึกในเครื่อง เพราะยังไม่ได้เชื่อม Google Sheets");
      }

      setActiveCategory(ALL_CATEGORY);
      resetForm();
      return true;
    } catch (error) {
      setStatus(`บันทึกไม่สำเร็จ: ${error.message}`);
      return false;
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

  return {
    activeCategory,
    categories,
    copiedId,
    editingId,
    filteredLinks,
    form,
    isLoading,
    isSaving,
    isSheetsConnected: Boolean(SHEETS_API_URL),
    query,
    sortBy,
    status,
    copyLink,
    removeLink,
    resetForm,
    saveLink,
    setActiveCategory,
    setQuery,
    setSortBy,
    startCreate,
    startEdit,
    updateForm,
  };
}

function upsertLink(currentLinks, savedLink, editingId) {
  if (!editingId) return [savedLink, ...currentLinks];
  return currentLinks.map((item) => (item.id === editingId ? savedLink : item));
}
