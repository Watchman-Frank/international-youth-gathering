import Link from "next/link";
import { Home, Search, BookOpen, Mic2, Calendar } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/articles", label: "Articles", icon: BookOpen },
  { href: "/word-for-the-day", label: "Word for the Day", icon: BookOpen },
  { href: "/podcast", label: "The Qavah Podcast", icon: Mic2 },
  { href: "/conference", label: "God-Life Conference", icon: Calendar },
];

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      {/* Decorative */}
      <div className="relative mb-8">
        <div className="text-[120px] sm:text-[160px] font-bold text-[#0D6B30]/5 select-none leading-none font-display">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-[#0D6B30] flex items-center justify-center shadow-xl">
            <svg width="36" height="36" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M9 2L11.5 7H16L12.5 10.5L14 15.5L9 12.5L4 15.5L5.5 10.5L2 7H6.5L9 2Z" fill="#C8831A" />
            </svg>
          </div>
        </div>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-[#0D6B30] font-display text-balance" style={{ fontFamily: "var(--font-display)" }}>
        Page Not Found
      </h1>
      <p className="text-slate-500 mt-3 text-base max-w-md leading-relaxed">
        The page you're looking for doesn't exist or may have moved. Let's get you back to the content that matters.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0D6B30] text-white font-semibold text-sm rounded-xl hover:bg-[#0A5423] transition-colors"
        >
          <Home size={16} aria-hidden />
          Back to Home
        </Link>
        <Link
          href="/search"
          className="flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 text-[#0D6B30] font-semibold text-sm rounded-xl hover:bg-slate-50 transition-colors"
        >
          <Search size={16} aria-hidden />
          Search IYG
        </Link>
      </div>

      <div className="mt-14 w-full max-w-sm">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Links</p>
        <div className="grid grid-cols-1 gap-2">
          {quickLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all text-sm text-[#0D6B30] font-medium"
            >
              <Icon size={16} className="text-[#C8831A]" aria-hidden />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
