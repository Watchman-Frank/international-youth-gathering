import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, Eye, ArrowLeft } from "lucide-react";
import { articles } from "@/lib/data/articles";
import { CategoryBadge } from "@/components/ui/Badge";
import { Reactions } from "@/components/ui/Reactions";
import { SocialShare } from "@/components/ui/SocialShare";
import { ArticleActions } from "@/components/ui/ArticleActions";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      images: [{ url: article.featuredImage, width: 1200, height: 630, alt: article.title }],
    },
  };
}

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const related = articles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  const allRelated = related.length < 3
    ? [
        ...related,
        ...articles.filter((a) => a.id !== article.id && !related.find((r) => r.id === a.id)).slice(0, 3 - related.length),
      ]
    : related;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0D6B30] transition-colors mb-8 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" aria-hidden />
          Back to Articles
        </Link>

        <div className="max-w-3xl mx-auto">
          {/* Category + Date */}
          <div className="flex items-center gap-3 flex-wrap mb-5">
            <CategoryBadge category={article.category} />
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar size={11} aria-hidden />
              {formatDate(article.publishedAt)}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock size={11} aria-hidden />
              {article.readingTime}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Eye size={11} aria-hidden />
              {article.views.toLocaleString()} views
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0D6B30] leading-tight text-balance"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg sm:text-xl text-slate-500 mt-4 leading-relaxed text-pretty">
            {article.excerpt}
          </p>

          {/* Author + actions */}
          <div className="flex items-center justify-between gap-4 mt-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-white border border-slate-200"
              />
              <div>
                <p className="font-semibold text-[#0D6B30] text-sm">{article.author.name}</p>
                {article.author.role && (
                  <p className="text-xs text-slate-400">{article.author.role}</p>
                )}
              </div>
            </div>
            <ArticleActions articleId={article.id} />
          </div>

          {/* Featured Image */}
          <figure className="mt-8 -mx-4 sm:mx-0">
            <div className="sm:rounded-2xl overflow-hidden aspect-[16/9]">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          </figure>

          {/* Body */}
          <article
            className="prose-iyg mt-10"
            aria-label={article.title}
            dangerouslySetInnerHTML={{ __html: article.body }}
          />

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-slate-100">
            <span className="text-xs text-slate-400 font-medium mr-1 mt-0.5">Tags:</span>
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors px-3 py-1 rounded-full cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Reactions + Share */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-100">
            <Reactions likes={article.reactions.likes} hearts={article.reactions.hearts} />
            <SocialShare
              url={`https://internationalyouthgathering.org/articles/${article.slug}`}
              title={article.title}
            />
          </div>

          {/* Author bio box */}
          {article.author.bio && (
            <div className="mt-8 p-6 bg-[#F0FAF3] rounded-2xl border border-slate-100 flex gap-4">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-14 h-14 rounded-full object-cover flex-shrink-0"
              />
              <div>
                <p className="font-bold text-[#0D6B30] text-sm">{article.author.name}</p>
                {article.author.role && (
                  <p className="text-xs text-[#C8831A] font-semibold">{article.author.role}</p>
                )}
                <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{article.author.bio}</p>
              </div>
            </div>
          )}

          {/* Comments */}
          <section aria-labelledby="comments-heading" className="mt-12 pt-8 border-t border-slate-100">
            <h2
              id="comments-heading"
              className="text-xl font-bold text-[#0D6B30] mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Comments
            </h2>
            <div className="bg-[#F0FAF3] border border-slate-200 rounded-2xl p-8 text-center">
              <p className="text-slate-500 text-sm leading-relaxed">
                Sign in to leave a comment and join the conversation.
              </p>
              <Link
                href="/sign-in"
                className="mt-4 inline-block px-6 py-2.5 bg-[#0D6B30] text-white text-sm font-bold rounded-xl hover:bg-[#0A5423] transition-colors"
              >
                Sign In to Comment
              </Link>
            </div>
          </section>
        </div>

        {/* Related Articles */}
        {allRelated.length > 0 && (
          <section
            aria-labelledby="related-heading"
            className="mt-16 pt-12 border-t border-slate-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                id="related-heading"
                className="text-2xl font-bold text-[#0D6B30]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Related Articles
              </h2>
              <Link href="/articles" className="text-sm font-semibold text-slate-500 hover:text-[#0D6B30] transition-colors flex items-center gap-1">
                All articles <ArrowLeft size={13} className="rotate-180" aria-hidden />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {allRelated.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
