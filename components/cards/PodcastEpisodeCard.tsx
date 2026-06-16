import Link from "next/link";
import { Play, Clock } from "lucide-react";
import type { PodcastEpisode } from "@/lib/types";
import { formatDuration, formatShortDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PodcastEpisodeCardProps {
  episode: PodcastEpisode;
  variant?: "default" | "compact";
  className?: string;
}

export function PodcastEpisodeCard({ episode, variant = "default", className }: PodcastEpisodeCardProps) {
  if (variant === "compact") {
    return (
      <Link
        href={`/podcast/${episode.id}`}
        className={cn("flex gap-3 group p-3 rounded-xl hover:bg-slate-50 transition-colors", className)}
      >
        <div className="relative flex-shrink-0">
          <img src={episode.thumbnailUrl} alt={episode.title} className="w-16 h-16 rounded-lg object-cover" loading="lazy" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-[#C8831A]/90 flex items-center justify-center">
              <Play size={12} className="text-[#0D6B30] ml-0.5" fill="currentColor" />
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-slate-400 mb-0.5">Ep. {episode.episode}</div>
          <h4 className="text-sm font-semibold text-[#0D6B30] line-clamp-2 leading-snug group-hover:text-[#0A5423] transition-colors">
            {episode.title}
          </h4>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
            <Clock size={11} aria-hidden />
            <span>{formatDuration(episode.duration)}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/podcast/${episode.id}`}
      className={cn(
        "block bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 group",
        className
      )}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={episode.thumbnailUrl}
          alt={episode.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-[#C8831A] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play size={22} className="text-[#0D6B30] ml-1" fill="currentColor" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
          <Clock size={10} aria-hidden />
          {formatDuration(episode.duration)}
        </div>
        {episode.season && episode.episode && (
          <div className="absolute top-2 left-2 bg-[#C8831A] text-[#0D6B30] text-xs font-bold px-2 py-0.5 rounded-full">
            S{episode.season} E{episode.episode}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3
          className="font-bold text-[#0D6B30] text-sm leading-snug line-clamp-2 group-hover:text-[#0A5423] transition-colors"
          style={{ fontFamily: "var(--font-display, Georgia, serif)" }}
        >
          {episode.title}
        </h3>
        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">{episode.description}</p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-400">{formatShortDate(episode.publishedAt)}</span>
          {episode.guests && episode.guests.length > 0 && (
            <span className="text-xs text-slate-500">with {episode.guests[0]}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
