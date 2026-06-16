import { articles } from "@/lib/data/articles";
import { resources } from "@/lib/data/library";
import { BarChart2, Eye, Download, FileText, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Analytics — IYG Admin" };

function Bar({ value, max, color = "bg-[#1B2A4A]" }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function AnalyticsPage() {
  const totalViews = articles.reduce((s, a) => s + (a.views ?? 0), 0);
  const totalLikes = articles.reduce((s, a) => s + (a.reactions?.likes ?? 0), 0);
  const totalDownloads = resources.reduce((s, r) => s + (r.downloads ?? 0), 0);

  const topArticles = [...articles].sort((a, b) => (b.views ?? 0) - (a.views ?? 0)).slice(0, 8);
  const maxViews = topArticles[0]?.views ?? 1;

  const topResources = [...resources].filter((r) => r.downloads).sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0)).slice(0, 6);
  const maxDownloads = topResources[0]?.downloads ?? 1;

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1B2A4A]" style={{ fontFamily: "var(--font-display)" }}>Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Content engagement across articles and library resources.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Articles", value: articles.length, icon: FileText, color: "text-[#1B2A4A]", bg: "bg-[#1B2A4A]/5" },
          { label: "Total Views", value: totalViews.toLocaleString(), icon: Eye, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Likes", value: totalLikes.toLocaleString(), icon: BarChart2, color: "text-[#F2B134]", bg: "bg-amber-50" },
          { label: "Total Downloads", value: totalDownloads.toLocaleString(), icon: Download, color: "text-green-600", bg: "bg-green-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-100 p-5">
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon size={17} className={color} />
            </div>
            <p className="text-2xl font-bold text-[#1B2A4A]">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Top Articles */}
      <div className="bg-white rounded-xl border border-slate-100 p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Eye size={16} className="text-[#1B2A4A]" />
          <h2 className="font-bold text-[#1B2A4A]" style={{ fontFamily: "var(--font-display)" }}>Most Viewed Articles</h2>
        </div>
        <div className="space-y-4">
          {topArticles.map((a, i) => (
            <div key={a.id} className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-300 w-4 text-right flex-shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1B2A4A] truncate">{a.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Bar value={a.views ?? 0} max={maxViews} />
                  <span className="text-xs text-slate-500 flex-shrink-0">{(a.views ?? 0).toLocaleString()} views</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0 hidden sm:block">
                <span className="text-xs text-slate-400">{a.reactions.likes} ❤️</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Resources */}
      <div className="bg-white rounded-xl border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-5">
          <BookOpen size={16} className="text-[#1B2A4A]" />
          <h2 className="font-bold text-[#1B2A4A]" style={{ fontFamily: "var(--font-display)" }}>Most Downloaded Resources</h2>
        </div>
        {topResources.length === 0 ? (
          <p className="text-sm text-slate-400">No download data yet.</p>
        ) : (
          <div className="space-y-4">
            {topResources.map((r, i) => (
              <div key={r.id} className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-300 w-4 text-right flex-shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1B2A4A] truncate">{r.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Bar value={r.downloads ?? 0} max={maxDownloads} color="bg-[#F2B134]" />
                    <span className="text-xs text-slate-500 flex-shrink-0">{(r.downloads ?? 0).toLocaleString()} downloads</span>
                  </div>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0 hidden sm:block capitalize">{r.type}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
