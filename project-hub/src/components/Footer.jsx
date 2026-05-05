import { Globe, Heart, Layers } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo + copyright */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-600 text-white">
            <Layers size={12} aria-hidden="true" />
          </span>
          <span>
            <strong className="text-gray-700 dark:text-gray-300">Project Hub</strong>
            {" "}© {year}
          </span>
        </div>

        {/* Built with */}
        <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
          Built with{" "}
          <Heart size={11} className="text-rose-400" aria-hidden="true" />
          {" "}using React + Tailwind, hosted on{" "}
          <a
            href="https://pages.github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            GitHub Pages
          </a>
        </p>

        {/* Social */}
        <a
          href="https://github.com/SuraBon"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="GitHub profile (opens in new tab)"
        >
          <Globe size={14} aria-hidden="true" />
          SuraBon
        </a>
      </div>
    </footer>
  );
}
