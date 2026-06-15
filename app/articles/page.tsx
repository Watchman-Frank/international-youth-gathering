"use client";

import { useState, useMemo } from "react";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { articles, categories } from "@/lib/data/articles";
import type { ArticleCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PenLine } from "lucide-react";
import Link from "next/link";

export default function ArticlesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchCat = category === "All" || a.category === category;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.author.name.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [search, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1
          className="text-3xl sm:text-4xl font-bold text-[#1B2A4A]"
          style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}
        >
          Articles
        </h1>
        <p className="text-slate-500 mt-2 text-base">
          Faith, culture, ministry, and Kingdom perspective from the IYG community.
        </p>
      </div>

      {/* Featured article */}
      {articles[0] && (
        <div className="mb-10">
          <ArticleCard article={articles[0]} variant="featured" />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-8">
        <SearchBar
          placeholder="Search articles…"
          value={search}
          onChange={setSearch}
          className="w-full sm:w-72"
        />
        <div className="flex gap-2 flex-wrap" role="group" aria-label="Filter by category">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border",
                category === cat
                  ? "bg-[#1B2A4A] text-white border-[#1B2A4A]"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-slate-300 text-6xl mb-4">📰</div>
          <h3 className="font-semibold text-slate-600 text-lg">No articles found</h3>
          <p className="text-slate-400 text-sm mt-1">Try a different search term or category.</p>
          <button
            onClick={() => { setSearch(""); setCategory("All"); }}
            className="mt-4 text-sm font-semibold text-[#1B2A4A] underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Submit CTA */}
      <div className="mt-16 bg-[#FAF8F3] border border-slate-200 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-14 h-14 rounded-2xl bg-[#1B2A4A] flex items-center justify-center flex-shrink-0">
          <PenLine size={24} className="text-[#F2B134]" aria-hidden />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="font-bold text-[#1B2A4A] text-xl" style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}>
            Have something to share?
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Submit an article to the IYG editorial team. We welcome testimonies, devotionals, and kingdom-culture commentary.
          </p>
        </div>
        <Link
          href="/articles/submit"
          className="flex-shrink-0 px-6 py-3 bg-[#1B2A4A] text-white font-semibold text-sm rounded-xl hover:bg-[#2D4070] transition-colors"
        >
          Submit Article
        </Link>
      </div>
    </div>
  );
}
