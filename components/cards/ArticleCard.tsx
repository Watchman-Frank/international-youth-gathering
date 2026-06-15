import Link from "next/link";
import { Clock, Eye } from "lucide-react";
import type { Article } from "@/lib/types";
import { CategoryBadge } from "@/components/ui/Badge";
import { formatShortDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "horizontal" | "featured" | "compact";
  className?: string;
}

export function ArticleCard({ article, variant = "default", className }: ArticleCardProps) {
  if (variant === "compact") {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className={cn(
          "flex gap-3 group p-3 rounded-xl hover:bg-slate-50 transition-colors",
          className
        )}
      >
        <img
          src={article.featuredImage}
          alt={article.title}
          className="w-20 h-16 rounded-lg object-cover flex-shrink-0"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <CategoryBadge category={article.category} />
          <h3 className="text-sm font-semibold text-[#1B2A4A] mt-1 line-clamp-2 group-hover:text-[#2D4070] transition-colors leading-snug" style={{ fontFamily: "var(--font-display, Georgia, serif)" }}>
            {article.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1">{formatShortDate(article.publishedAt)}</p>
        </div>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className={cn(
          "card-beam flex gap-4 group p-4 bg-white rounded-xl border border-slate-100 hover:border-[#F2B134]/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300",
          className
        )}
      >
        <img
          src={article.featuredImage}
          alt={article.title}
          className="w-32 h-24 rounded-lg object-cover flex-shrink-0"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <CategoryBadge category={article.category} />
          <h3 className="text-base font-bold text-[#1B2A4A] mt-1.5 line-clamp-2 group-hover:text-[#2D4070] transition-colors" style={{ fontFamily: "var(--font-display, Georgia, serif)" }}>
            {article.title}
          </h3>
          <p className="text-sm text-slate-500 mt-1 line-clamp-2">{article.excerpt}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
            <span>{formatShortDate(article.publishedAt)}</span>
            <span className="flex items-center gap-1"><Clock size={11} aria-hidden />{article.readingTime}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className={cn(
          "relative block rounded-2xl overflow-hidden group h-80 md:h-96 transition-all duration-300 hover:ring-2 hover:ring-[#F2B134]/50 hover:ring-offset-2 hover:ring-offset-[#FAF8F3]",
          className
        )}
      >
        <img
          src={article.featuredImage}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B2A4A]/90 via-[#1B2A4A]/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <CategoryBadge category={article.category} />
          <h2 className="text-xl md:text-2xl font-bold text-white mt-2 line-clamp-2 text-balance" style={{ fontFamily: "var(--font-display, Georgia, serif)" }}>
            {article.title}
          </h2>
          <div className="flex items-center gap-3 mt-3">
            <img src={article.author.avatar} alt={article.author.name} className="w-7 h-7 rounded-full object-cover" />
            <span className="text-white/80 text-sm">{article.author.name}</span>
            <span className="text-white/50 text-sm">·</span>
            <span className="text-white/60 text-xs">{formatShortDate(article.publishedAt)}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/articles/${article.slug}`}
      className={cn(
        "card-beam block bg-white rounded-xl overflow-hidden border border-slate-100 hover:border-slate-200 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 group",
        className
      )}
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={article.featuredImage}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <CategoryBadge category={article.category} />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-[#1B2A4A] text-base leading-snug line-clamp-2 group-hover:text-[#2D4070] transition-colors" style={{ fontFamily: "var(--font-display, Georgia, serif)" }}>
          {article.title}
        </h3>
        <p className="text-sm text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">{article.excerpt}</p>
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100">
          <img src={article.author.avatar} alt={article.author.name} className="w-7 h-7 rounded-full object-cover" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-700 truncate">{article.author.name}</p>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-[11px]">{formatShortDate(article.publishedAt)}</span>
              <span className="text-[11px] flex items-center gap-0.5"><Clock size={10} aria-hidden />{article.readingTime}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-[11px]">
            <Eye size={11} aria-hidden />
            <span>{article.views >= 1000 ? `${(article.views / 1000).toFixed(1)}k` : article.views}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
