import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { Reactions } from "@/components/ui/Reactions";
import { SocialShare } from "@/components/ui/SocialShare";
import { PodcastEpisodeCard } from "@/components/cards/PodcastEpisodeCard";
import { podcastEpisodes } from "@/lib/data/podcast";
import { formatDate, formatDuration } from "@/lib/utils";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const ep = podcastEpisodes.find((e) => e.id === id);
  if (!ep) return {};
  return { title: ep.title, description: ep.description };
}

export async function generateStaticParams() {
  return podcastEpisodes.map((ep) => ({ id: ep.id }));
}

export default async function PodcastEpisodePage({ params }: Props) {
  const { id } = await params;
  const ep = podcastEpisodes.find((e) => e.id === id);
  if (!ep) notFound();

  const related = podcastEpisodes.filter((e) => e.id !== ep.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/podcast" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0D6B30] mb-6">
        <ArrowLeft size={14} aria-hidden />
        Back to The Qavah Podcast
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <VideoPlayer
            youtubeId={ep.youtubeId}
            thumbnailUrl={ep.thumbnailUrl}
            title={ep.title}
          />

          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Season {ep.season} · Episode {ep.episode}
            </div>
            <h1
              className="text-2xl sm:text-3xl font-bold text-[#0D6B30] mt-2 leading-tight"
              style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}
            >
              {ep.title}
            </h1>
            <div className="flex items-center gap-4 mt-3 text-sm text-slate-400">
              <span>{formatDate(ep.publishedAt)}</span>
              <span className="flex items-center gap-1"><Clock size={13} aria-hidden />{formatDuration(ep.duration)}</span>
              {ep.guests && ep.guests.length > 0 && (
                <span>with {ep.guests.join(", ")}</span>
              )}
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed">{ep.description}</p>

          {ep.showNotes && (
            <div className="bg-[#F0FAF3] rounded-2xl p-6">
              <h2 className="font-bold text-[#0D6B30] mb-3" style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}>
                Show Notes
              </h2>
              <pre className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed font-sans">{ep.showNotes}</pre>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4 border-t border-slate-100">
            <Reactions likes={ep.reactions.likes} hearts={ep.reactions.hearts} />
            <SocialShare title={ep.title} />
          </div>

          {/* Comments */}
          <section aria-labelledby="ep-comments-heading" className="pt-6 border-t border-slate-100">
            <h2
              id="ep-comments-heading"
              className="font-bold text-xl text-[#0D6B30] mb-4"
              style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}
            >
              Comments
            </h2>
            <div className="bg-[#F0FAF3] rounded-xl p-6 text-center">
              <p className="text-slate-500 text-sm">Sign in to leave a comment.</p>
              <Link href="/sign-in" className="mt-3 inline-block px-5 py-2 bg-[#0D6B30] text-white text-sm font-semibold rounded-lg">
                Sign In
              </Link>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div>
          <h2
            className="font-bold text-[#0D6B30] text-base mb-4"
            style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}
          >
            More Episodes
          </h2>
          <div className="space-y-2">
            {related.map((e) => (
              <PodcastEpisodeCard key={e.id} episode={e} variant="compact" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
