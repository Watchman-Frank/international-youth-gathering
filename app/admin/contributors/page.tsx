import { articles } from "@/lib/data/articles";
import type { Author } from "@/lib/types";
import { Globe, AtSign, FileText } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contributors — IYG Admin" };

interface AuthorProfile {
  author: Author;
  articleCount: number;
  articles: { id: string; title: string; slug: string; publishedAt: string }[];
}

function buildProfiles(): AuthorProfile[] {
  const map = new Map<string, AuthorProfile>();
  for (const article of articles) {
    const { author } = article;
    if (!map.has(author.id)) {
      map.set(author.id, { author, articleCount: 0, articles: [] });
    }
    const profile = map.get(author.id)!;
    profile.articleCount += 1;
    profile.articles.push({
      id: article.id,
      title: article.title,
      slug: article.slug,
      publishedAt: article.publishedAt,
    });
  }
  return Array.from(map.values()).sort((a, b) => b.articleCount - a.articleCount);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function ContributorsPage() {
  const profiles = buildProfiles();

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0D6B30]" style={{ fontFamily: "var(--font-display)" }}>
          Contributors
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {profiles.length} author{profiles.length !== 1 ? "s" : ""} · {articles.length} articles total
        </p>
      </div>

      <div className="space-y-6">
        {profiles.map(({ author, articleCount, articles: authored }) => (
          <div
            key={author.id}
            className="bg-white rounded-xl border border-slate-100 overflow-hidden"
          >
            {/* Author header */}
            <div className="flex items-start gap-5 p-6 border-b border-slate-100">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-16 h-16 rounded-full object-cover flex-shrink-0 border border-slate-100"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="text-base font-bold text-[#0D6B30]" style={{ fontFamily: "var(--font-display)" }}>
                      {author.name}
                    </h2>
                    {author.role && (
                      <span className="inline-block mt-0.5 text-xs font-semibold text-[#C8831A] bg-[#C8831A]/10 px-2 py-0.5 rounded-full">
                        {author.role}
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full flex-shrink-0">
                    <FileText size={12} aria-hidden />
                    {articleCount} article{articleCount !== 1 ? "s" : ""}
                  </span>
                </div>

                {author.bio && (
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">{author.bio}</p>
                )}

                {/* Portfolio / socials */}
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  {author.website && (
                    <a
                      href={author.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#0D6B30] hover:text-[#C8831A] transition-colors"
                    >
                      <Globe size={13} aria-hidden />
                      Website
                    </a>
                  )}
                  {author.socials && Object.entries(author.socials).map(([platform, url]) =>
                    url ? (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0D6B30] transition-colors capitalize"
                      >
                        <AtSign size={13} aria-hidden />
                        {platform}
                      </a>
                    ) : null
                  )}
                  {!author.website && !author.socials && (
                    <span className="text-xs text-slate-300 italic">No portfolio links added</span>
                  )}
                </div>
              </div>
            </div>

            {/* Articles list */}
            <ul className="divide-y divide-slate-50">
              {authored.map((a) => (
                <li key={a.id} className="flex items-center justify-between px-6 py-3 gap-4">
                  <Link
                    href={`/articles/${a.slug}`}
                    target="_blank"
                    className="text-sm text-slate-700 hover:text-[#0D6B30] font-medium leading-snug line-clamp-1 flex-1"
                  >
                    {a.title}
                  </Link>
                  <span className="text-xs text-slate-400 flex-shrink-0">{formatDate(a.publishedAt)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
