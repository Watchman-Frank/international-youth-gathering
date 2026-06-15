"use client";

import { useState, useMemo } from "react";
import { Library, Search } from "lucide-react";
import { ResourceCard } from "@/components/cards/ResourceCard";
import { resources, topics, resourceTypes } from "@/lib/data/library";
import { cn } from "@/lib/utils";

export default function LibraryPage() {
  const [topic, setTopic] = useState<string>("All");
  const [type, setType] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const matchTopic = topic === "All" || r.topic === topic;
      const matchType = type === "All" || r.type === type;
      const matchFree = !showFreeOnly || r.isFree;
      const q = search.toLowerCase();
      const matchSearch = !q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
      return matchTopic && matchType && matchFree && matchSearch;
    });
  }, [topic, type, search, showFreeOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#1B2A4A] flex items-center justify-center">
            <Library size={20} className="text-[#F2B134]" aria-hidden />
          </div>
          <h1
            className="text-3xl font-bold text-[#1B2A4A]"
            style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}
          >
            Library
          </h1>
        </div>
        <p className="text-slate-500 text-base">
          Free and premium resources to help you grow, lead, and serve. Sign in to download free materials.
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134] focus:border-transparent"
              aria-label="Search library"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showFreeOnly}
              onChange={(e) => setShowFreeOnly(e.target.checked)}
              className="w-4 h-4 rounded accent-[#F2B134]"
            />
            <span className="text-sm font-medium text-slate-600">Free only</span>
          </label>
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              aria-pressed={topic === t}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all",
                topic === t
                  ? "bg-[#1B2A4A] text-white border-[#1B2A4A]"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by type">
          {resourceTypes.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              aria-pressed={type === t}
              className={cn(
                "px-3 py-1 rounded-full text-[11px] font-semibold border transition-all capitalize",
                type === t
                  ? "bg-[#F2B134] text-[#1B2A4A] border-[#F2B134]"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <>
          <p className="text-sm text-slate-500">{filtered.length} resource{filtered.length !== 1 ? "s" : ""} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="font-semibold text-slate-600 text-lg">No resources found</h3>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your filters.</p>
          <button
            onClick={() => { setTopic("All"); setType("All"); setSearch(""); setShowFreeOnly(false); }}
            className="mt-4 text-sm font-semibold text-[#1B2A4A] underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Sign in CTA */}
      <div className="bg-[#1B2A4A] rounded-2xl p-8 text-white text-center">
        <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}>
          Want to download free resources?
        </h2>
        <p className="text-white/60 text-sm mb-5">Create a free IYG account to access all free downloads, save your progress, and get notified when new resources drop.</p>
        <a
          href="/sign-in"
          className="inline-block px-6 py-3 bg-[#F2B134] text-[#1B2A4A] font-bold text-sm rounded-xl hover:bg-[#D9960F] transition-colors"
        >
          Create Free Account
        </a>
      </div>
    </div>
  );
}
