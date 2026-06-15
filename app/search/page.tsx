"use client";

import { useState, useMemo } from "react";
import { SearchBar } from "@/components/ui/SearchBar";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { PodcastEpisodeCard } from "@/components/cards/PodcastEpisodeCard";
import { articles } from "@/lib/data/articles";
import { podcastEpisodes } from "@/lib/data/podcast";
import { devotionals } from "@/lib/data/devotionals";
import { resources } from "@/lib/data/library";
import { BookOpen, Mic2, Newspaper, Library } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const q = query.toLowerCase();

  const results = useMemo(() => {
    if (!q) return { articles: [], podcast: [], devotionals: [], resources: [] };
    return {
      articles: articles.filter(
        (a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
      ),
      podcast: podcastEpisodes.filter(
        (e) => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)
      ),
      devotionals: devotionals.filter(
        (d) => d.title.toLowerCase().includes(q) || d.scripture?.toLowerCase().includes(q)
      ),
      resources: resources.filter(
        (r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.topic.toLowerCase().includes(q)
      ),
    };
  }, [q]);

  const total = q ? Object.values(results).reduce((s, arr) => s + arr.length, 0) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1B2A4A] mb-4" style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}>
          Search IYG
        </h1>
        <SearchBar
          placeholder="Search articles, devotionals, podcast, library…"
          value={query}
          onChange={setQuery}
          size="lg"
        />
        {q && (
          <p className="text-sm text-slate-500 mt-3">
            {total} result{total !== 1 ? "s" : ""} for <strong>"{query}"</strong>
          </p>
        )}
      </div>

      {!q && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-slate-500">Start typing to search across all IYG content.</p>
        </div>
      )}

      {q && total === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="font-semibold text-slate-600 text-lg">No results found</h2>
          <p className="text-slate-400 text-sm mt-1">Try different keywords or browse our sections.</p>
        </div>
      )}

      {/* Articles */}
      {results.articles.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Newspaper size={16} className="text-[#1B2A4A]" aria-hidden />
            <h2 className="font-bold text-[#1B2A4A] text-base" style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}>
              Articles ({results.articles.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.articles.map((a) => <ArticleCard key={a.id} article={a} variant="horizontal" />)}
          </div>
        </section>
      )}

      {/* Podcast */}
      {results.podcast.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Mic2 size={16} className="text-[#1B2A4A]" aria-hidden />
            <h2 className="font-bold text-[#1B2A4A] text-base" style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}>
              Podcast ({results.podcast.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.podcast.map((e) => <PodcastEpisodeCard key={e.id} episode={e} variant="compact" />)}
          </div>
        </section>
      )}

      {/* Devotionals */}
      {results.devotionals.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={16} className="text-[#1B2A4A]" aria-hidden />
            <h2 className="font-bold text-[#1B2A4A] text-base" style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}>
              Word for the Day ({results.devotionals.length})
            </h2>
          </div>
          <div className="space-y-3">
            {results.devotionals.map((d) => (
              <a key={d.id} href="/word-for-the-day" className="flex gap-3 p-3 bg-white rounded-xl border border-slate-100 hover:shadow-sm transition-all">
                <img src={d.thumbnailUrl} alt={d.title} className="w-20 h-14 rounded-lg object-cover flex-shrink-0" />
                <div>
                  <div className="text-xs text-[#F2B134] font-semibold">{d.scripture}</div>
                  <h3 className="font-semibold text-[#1B2A4A] text-sm mt-0.5" style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}>{d.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{d.summary}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Resources */}
      {results.resources.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Library size={16} className="text-[#1B2A4A]" aria-hidden />
            <h2 className="font-bold text-[#1B2A4A] text-base" style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}>
              Library ({results.resources.length})
            </h2>
          </div>
          <div className="space-y-3">
            {results.resources.map((r) => (
              <a key={r.id} href="/library" className="flex gap-3 p-3 bg-white rounded-xl border border-slate-100 hover:shadow-sm transition-all">
                <img src={r.thumbnailUrl} alt={r.title} className="w-20 h-14 rounded-lg object-cover flex-shrink-0" />
                <div>
                  <div className="text-xs text-slate-400 capitalize">{r.type} · {r.topic}</div>
                  <h3 className="font-semibold text-[#1B2A4A] text-sm mt-0.5" style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}>{r.title}</h3>
                  <div className="text-xs font-semibold mt-0.5">{r.isFree ? <span className="text-green-600">Free</span> : <span className="text-amber-600">{r.price}</span>}</div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
