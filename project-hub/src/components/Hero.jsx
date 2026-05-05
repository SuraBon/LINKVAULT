import { ArrowDown, Globe, Mail } from "lucide-react";

export default function Hero({ totalProjects }) {
  const scrollToProjects = () => {
    document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      aria-label="Hero section"
    >
      {/* Background gradient blobs */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-indigo-400/20 dark:bg-indigo-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-400/20 dark:bg-violet-600/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-cyan-400/10 dark:bg-cyan-600/5 blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Avatar / Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
              <span className="text-white text-3xl font-bold select-none" aria-hidden="true">P</span>
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-950" aria-label="Online" />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700/50 text-indigo-700 dark:text-indigo-300 text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" aria-hidden="true" />
          {totalProjects} Projects &amp; Counting
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6 leading-tight">
          My{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
            Project Hub
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-4 leading-relaxed">
          A central hub for all the websites, systems, dashboards, and tools I have built.
        </p>
        <p className="text-base text-gray-500 dark:text-gray-500 max-w-xl mx-auto mb-10">
          Browse by category, filter by status, or search for anything — every project is one click away.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={scrollToProjects}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            View Projects
            <ArrowDown size={16} aria-hidden="true" />
          </button>

          <a
            href="https://github.com/SuraBon"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/15 text-gray-700 dark:text-gray-200 font-semibold text-sm border border-gray-200 dark:border-white/20 shadow-sm transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
          >
          <Globe size={16} aria-hidden="true" />
            GitHub — SuraBon
          </a>

          <a
            href="mailto:your@email.com"
            // TODO: replace with your real email
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/15 text-gray-700 dark:text-gray-200 font-semibold text-sm border border-gray-200 dark:border-white/20 shadow-sm transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
          >
            <Mail size={16} aria-hidden="true" />
            Contact Me
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex justify-center" aria-hidden="true">
          <button
            onClick={scrollToProjects}
            className="flex flex-col items-center gap-1 text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
            tabIndex={-1}
            aria-hidden="true"
          >
            <span className="text-xs">Scroll</span>
            <ArrowDown size={14} className="animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}
