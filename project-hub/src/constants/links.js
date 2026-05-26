export const STORAGE_KEY = "link-vault-items";
export const SHEETS_API_URL = import.meta.env.VITE_SHEETS_WEB_APP_URL?.trim() || "";
export const ALL_CATEGORY = "ทั้งหมด";

export const emptyLinkForm = {
  title: "",
  url: "",
  category: "",
  description: "",
};

export const seedLinks = [
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
