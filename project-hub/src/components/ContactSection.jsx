import { Mail, Globe, Share2, Users, ExternalLink } from "lucide-react";

const CONTACTS = [
  {
    icon: <Mail size={20} aria-hidden="true" />,
    label: "Email",
    value: "your@email.com",
    href: "mailto:your@email.com",
    external: false,
  },
  {
    icon: <Globe size={20} aria-hidden="true" />,
    label: "GitHub",
    value: "github.com/SuraBon",
    href: "https://github.com/SuraBon",
    external: true,
  },
  {
    icon: <Share2 size={20} aria-hidden="true" />,
    label: "Facebook",
    value: "facebook.com/yourprofile",
    href: "https://facebook.com/yourprofile",
    external: true,
  },
  {
    icon: <Users size={20} aria-hidden="true" />,
    label: "LinkedIn",
    value: "linkedin.com/in/yourprofile",
    href: "https://linkedin.com/in/yourprofile",
    external: true,
  },
];

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="py-20 px-4 sm:px-6 lg:px-8"
      aria-label="Contact section"
    >
      <div className="max-w-3xl mx-auto text-center">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">
          Get In Touch
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Let's connect
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-base mb-12 max-w-md mx-auto">
          Have a project idea, question, or just want to say hi? Reach out through any of the channels below.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CONTACTS.map((c) => (
            <a
              key={c.label}
              href={c.href}
              {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-800/60 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              aria-label={`${c.label}: ${c.value}${c.external ? " (opens in new tab)" : ""}`}
            >
              <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-800/40 transition-colors">
                {c.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {c.label}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {c.value}
                </p>
              </div>
              {c.external && (
                <ExternalLink
                  size={14}
                  className="flex-shrink-0 text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 transition-colors"
                  aria-hidden="true"
                />
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
