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
        className={cn("flex gap-3 group p-3 rounded-lg hover:bg-[#F0FAF3] transition-all duration-300", className)}
      >
        <img
          src={article.featuredImage}
          alt={article.title}
          className="w-20 h-16 rounded-md object-cover flex-shrink-0"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <CategoryBadge category={article.category} />
          <h3 className="text-sm font-semibold text-[#083D1C] mt-1 line-clamp-2 group-hover:text-[#0D6B30] transition-colors leading-snug" style={{ fontFamily: "var(--font-display, Georgia, serif)" }}>
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
          "flex gap-4 group p-4 bg-white rounded-lg border border-slate-100 hover:border-[#0D6B30]/20 hover:shadow-md hover:shadow-green-900/5 hover:-translate-y-0.5 transition-all duration-300",
          className
        )}
      >
        <img
          src={article.featuredImage}
          alt={article.title}
          className="w-32 h-24 rounded-md object-cover flex-shrink-0"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <CategoryBadge category={article.category} />
          <h3 className="text-base font-bold text-[#083D1C] mt-1.5 line-clamp-2 group-hover:text-[#0D6B30] transition-colors" style={{ fontFamily: "var(--font-display, Georgia, serif)" }}>
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
          "relative block rounded-2xl overflow-hidden group h-80 md:h-96 hover:shadow-2xl hover:shadow-green-900/25 transition-all duration-400",
          className
        )}
      >
        <img
          src={article.featuredImage}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#083D1C]/95 via-[#083D1C]/40 to-transparent" />
        {/* Gold top accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#C8831A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <CategoryBadge category={article.category} />
          <h2 className="text-xl md:text-2xl font-bold text-white mt-2 line-clamp-3 text-balance leading-snug" style={{ fontFamily: "var(--font-display, Georgia, serif)" }}>
            {article.title}
          </h2>
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
            <img src={article.author.avatar} alt={article.author.name} className="w-7 h-7 rounded-full object-cover ring-1 ring-[#C8831A]/60" />
            <span className="text-white/80 text-sm font-medium">{article.author.name}</span>
            <span className="text-white/30">·</span>
            <span className="text-white/50 text-xs">{formatShortDate(article.publishedAt)}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/articles/${article.slug}`}
      className={cn(
        "block bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-[#0D6B30]/15 hover:shadow-xl hover:shadow-green-900/8 hover:-translate-y-1.5 transition-all duration-300 group",
        className
      )}
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={article.featuredImage}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 left-3">
          <CategoryBadge category={article.category} />
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-[#083D1C] text-base leading-snug line-clamp-2 group-hover:text-[#0D6B30] transition-colors" style={{ fontFamily: "var(--font-display, Georgia, serif)" }}>
          {article.title}
        </h3>
        <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">{article.excerpt}</p>
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
          <img src={article.author.avatar} alt={article.author.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-[#F0FAF3]" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-700 truncate">{article.author.name}</p>
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
