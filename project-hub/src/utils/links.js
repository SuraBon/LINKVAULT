import { seedLinks, STORAGE_KEY } from "../constants/links";

export function normalizeUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function getHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function getInitials(title) {
  return title
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function loadLocalLinks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : seedLinks;
  } catch {
    return seedLinks;
  }
}

export function saveLocalLinks(links) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}

export function sortLinks(links, sortBy) {
  return [...links].sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title, "th");
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}

export function groupLinksByCategory(links) {
  return links.reduce((groups, link) => {
    const category = link.category || "ทั่วไป";
    if (!groups[category]) groups[category] = [];
    groups[category].push(link);
    return groups;
  }, {});
}
