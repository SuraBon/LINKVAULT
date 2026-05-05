/**
 * projects.js — Central project data store
 *
 * To add a project: copy one object, fill in the fields, and save.
 * Fields:
 *   id          — unique slug (no spaces)
 *   name        — display name
 *   description — short description (1–2 sentences)
 *   category    — one of: Website | Business System | HR System | Form System |
 *                          Dashboard | Tool | Experiment | Other
 *   status      — Live | In Development | Maintenance | Archived
 *   url         — live URL (leave "" if not deployed)
 *   repoUrl     — GitHub repo URL (leave "" if private/none)
 *   techStack   — array of tech badge strings
 *   featured    — true = shown in Featured section
 *   updatedAt   — ISO date string "YYYY-MM-DD"
 *   thumbnail   — image URL or "" for auto-generated placeholder
 *   notes       — internal notes (not shown in UI)
 */

export const projects = [
  {
    id: "hr-system",
    name: "HR System with Sheets",
    description: "Employee management and attendance tracking system with real-time Google Sheets integration for HR operations.",
    category: "HR System",
    status: "Live",
    url: "https://hr-systemswithsheets.vercel.app/login",
    repoUrl: "https://github.com/SuraBon",
    techStack: ["React", "Vite", "Google Sheets", "Vercel"],
    featured: true,
    updatedAt: "2026-05-05",
    thumbnail: "",
    notes: "Main HR system project",
  },
  {
    id: "gi-shirtsize",
    name: "GI Shirt Size Order",
    description: "Shirt ordering form system with size selection and Google Sheets database integration for order management.",
    category: "Form System",
    status: "Live",
    url: "https://surabon.github.io/GI-shirtsize/",
    repoUrl: "https://github.com/SuraBon/GI-shirtsize",
    techStack: ["JavaScript", "HTML", "CSS", "Google Sheets"],
    featured: true,
    updatedAt: "2026-05-05",
    thumbnail: "",
    notes: "Shirt order form",
  },
  {
    id: "gi-doctrack",
    name: "GI DocTrack",
    description: "Document tracking and management system for monitoring document workflows and status updates.",
    category: "Business System",
    status: "Live",
    url: "https://doc-track-sigma.vercel.app",
    repoUrl: "https://github.com/SuraBon/GI-DocTrack",
    techStack: ["TypeScript", "React", "Vercel"],
    featured: true,
    updatedAt: "2026-05-05",
    thumbnail: "",
    notes: "Document tracking system",
  },
  {
    id: "employee-tracker",
    name: "Employee Tracker",
    description: "Employee information and activity tracking system with comprehensive data management capabilities.",
    category: "HR System",
    status: "In Development",
    url: "",
    repoUrl: "https://github.com/SuraBon/employee_tracker",
    techStack: ["TypeScript", "React", "Vite"],
    featured: false,
    updatedAt: "2026-05-05",
    thumbnail: "",
    notes: "Employee tracking tool",
  },
  {
    id: "recipe-food",
    name: "Recipe Food",
    description: "Recipe collection and food management website with search and categorization features.",
    category: "Website",
    status: "Live",
    url: "",
    repoUrl: "https://github.com/SuraBon/Recipe-Food",
    techStack: ["HTML", "CSS", "JavaScript"],
    featured: false,
    updatedAt: "2026-05-05",
    thumbnail: "",
    notes: "Recipe website",
  },
  {
    id: "webhub",
    name: "WebHub",
    description: "Central hub for organizing and accessing multiple web projects and applications in one place.",
    category: "Website",
    status: "Live",
    url: "",
    repoUrl: "https://github.com/SuraBon/WebHub",
    techStack: ["JavaScript", "HTML", "CSS"],
    featured: false,
    updatedAt: "2026-05-05",
    thumbnail: "",
    notes: "Project hub",
  },
];

/** All unique categories derived from project data */
export const ALL_CATEGORIES = ["All", ...Array.from(new Set(projects.map((p) => p.category))).sort()];

/** All unique statuses derived from project data */
export const ALL_STATUSES = ["All", "Live", "In Development", "Maintenance", "Archived"];

/** All unique tech tags derived from project data */
export const ALL_TECH_TAGS = Array.from(
  new Set(projects.flatMap((p) => p.techStack))
).sort();
