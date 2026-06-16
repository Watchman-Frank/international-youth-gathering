import Link from "next/link";
import { articles } from "@/lib/data/articles";
import { events } from "@/lib/data/events";
import { resources } from "@/lib/data/library";
import { ArrowRight, BookOpen, Calendar, FileText, Library } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Content — IYG Admin" };

export default function ContentPage() {
  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1B2A4A]" style={{ fontFamily: "var(--font-display)" }}>Content</h1>
        <p className="text-sm text-slate-500 mt-1">Overview of all website content. Use the Library admin to add or remove resources live.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {[
          { href: "/admin/library", icon: Library, label: "Library", count: resources.length, unit: "resources", action: "Add / Remove Resources", live: true },
          { href: "/admin/submissions", icon: FileText, label: "Articles", count: articles.length, unit: "published", action: "Review Submissions", live: true },
          { href: "/admin/registrations", icon: Calendar, label: "Events", count: events.length, unit: "events", action: "View Registrations", live: true },
        ].map(({ href, icon: Icon, label, count, unit, action, live }) => (
          <Link key={label} href={href} className="group block bg-white rounded-xl border border-slate-100 p-6 hover:border-slate-200 hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-lg bg-[#1B2A4A]/5 flex items-center justify-center">
                <Icon size={18} className="text-[#1B2A4A]" />
              </div>
              {live && <span className="text-[10px] font-bold text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">Live</span>}
            </div>
            <p className="text-3xl font-bold text-[#1B2A4A] mt-4">{count}</p>
            <p className="text-sm text-slate-500">{label} · {unit}</p>
            <div className="flex items-center gap-1 text-xs font-bold text-[#1B2A4A] group-hover:text-[#F2B134] transition-colors mt-4">
              {action} <ArrowRight size={12} />
            </div>
          </Link>
        ))}

        <div className="bg-[#FAF8F3] rounded-xl border border-slate-100 p-6">
          <div className="w-10 h-10 rounded-lg bg-[#1B2A4A]/5 flex items-center justify-center mb-4">
            <BookOpen size={18} className="text-[#1B2A4A]" />
          </div>
          <p className="font-bold text-[#1B2A4A] text-sm mb-1">Hero &amp; Static Copy</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Homepage hero slides, core values, and about text are managed in the codebase.
            Ask your developer to update <code className="bg-white px-1 rounded text-[11px]">components/home/HeroCarousel.tsx</code> and <code className="bg-white px-1 rounded text-[11px]">app/about/page.tsx</code>.
          </p>
        </div>
      </div>

      {/* Articles quick list */}
      <div className="bg-white rounded-xl border border-slate-100 p-6 mb-5">
        <h2 className="font-bold text-[#1B2A4A] mb-4" style={{ fontFamily: "var(--font-display)" }}>Published Articles ({articles.length})</h2>
        <div className="space-y-2">
          {articles.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-4 py-2 border-b border-slate-50 last:border-0">
              <p className="text-sm font-medium text-[#1B2A4A] line-clamp-1 flex-1">{a.title}</p>
              <span className="text-xs text-slate-400 flex-shrink-0">{new Date(a.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
              <Link href={`/articles/${a.slug}`} target="_blank" className="text-xs font-semibold text-slate-400 hover:text-[#1B2A4A] flex-shrink-0">View →</Link>
            </div>
          ))}
        </div>
      </div>

      {/* Events quick list */}
      <div className="bg-white rounded-xl border border-slate-100 p-6">
        <h2 className="font-bold text-[#1B2A4A] mb-4" style={{ fontFamily: "var(--font-display)" }}>Events ({events.length})</h2>
        <div className="space-y-2">
          {events.map((e) => (
            <div key={e.id} className="flex items-center justify-between gap-4 py-2 border-b border-slate-50 last:border-0">
              <p className="text-sm font-medium text-[#1B2A4A] line-clamp-1 flex-1">{e.title}</p>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${e.isUpcoming ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}>{e.isUpcoming ? "Upcoming" : "Past"}</span>
              <Link href="/admin/registrations" className="text-xs font-semibold text-slate-400 hover:text-[#1B2A4A] flex-shrink-0">Registrations →</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
