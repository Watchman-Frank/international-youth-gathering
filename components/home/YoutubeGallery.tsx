"use client";

import { useState, useEffect } from "react";
import { Play, ExternalLink, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { YTVideo } from "@/lib/youtube";

function formatDuration(secs: number) {
  if (!secs) return "";
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function VideoCard({ video, featured = false }: { video: YTVideo; featured?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const ytUrl = `https://www.youtube.com/watch?v=${video.id}`;

  return (
    <a
      href={ytUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "group block relative overflow-hidden rounded-xl bg-[#0D1624]",
        featured ? "aspect-video" : "aspect-video"
      )}
      aria-label={`Watch: ${video.title}`}
    >
      {/* Thumbnail */}
      <img
        src={video.thumbnailUrl}
        alt={video.title}
        className={cn(
          "w-full h-full object-cover transition-transform duration-500",
          hovered ? "scale-105 opacity-70" : "opacity-90"
        )}
        loading="lazy"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Play button */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center transition-all duration-300",
        hovered ? "opacity-100" : "opacity-80"
      )}>
        <div className={cn(
          "flex items-center justify-center rounded-full bg-[#F2B134] transition-all duration-300 shadow-lg",
          featured ? "w-16 h-16" : "w-11 h-11",
          hovered && "scale-110"
        )}>
          <Play
            className="text-[#1B2A4A] ml-0.5"
            fill="currentColor"
            size={featured ? 24 : 16}
            aria-hidden
          />
        </div>
      </div>

      {/* Duration badge */}
      {video.duration > 0 && (
        <span className="absolute bottom-10 right-2 text-[10px] font-bold text-white bg-black/75 px-1.5 py-0.5 rounded">
          {formatDuration(video.duration)}
        </span>
      )}

      {/* Title */}
      <div className="absolute bottom-0 inset-x-0 p-3">
        <p
          className={cn(
            "font-bold text-white leading-snug line-clamp-2",
            featured ? "text-base" : "text-xs"
          )}
          style={{ fontFamily: "var(--font-display)" }}
        >
          {video.title}
        </p>
      </div>

      {/* Watch prompt on hover */}
      <div className={cn(
        "absolute top-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F2B134] text-[#1B2A4A] text-[10px] font-bold transition-all duration-300",
        hovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
      )}>
        <ExternalLink size={10} aria-hidden />
        Watch on YouTube
      </div>
    </a>
  );
}

function SkeletonCard() {
  return <div className="aspect-video rounded-xl skeleton" />;
}

export function YoutubeGallery() {
  const [videos, setVideos] = useState<YTVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [unconfigured, setUnconfigured] = useState(false);

  useEffect(() => {
    fetch("/api/youtube/latest?limit=7")
      .then((r) => r.json())
      .then((data) => {
        if (!data.configured) { setUnconfigured(true); return; }
        setVideos(data.videos ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const channelUrl = `https://www.youtube.com/@${process.env.NEXT_PUBLIC_CHANNEL_HANDLE ?? "InternationalYouthGathering"}`;

  if (unconfigured) return null;

  return (
    <section aria-labelledby="yt-gallery-heading">
      {/* Header */}
      <div className="flex items-end justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <PlayCircle size={18} className="text-red-500" aria-hidden />
            <h2
              id="yt-gallery-heading"
              className="text-2xl sm:text-3xl font-bold text-[#1B2A4A]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Watch &amp; Learn
            </h2>
          </div>
          <p className="text-sm text-slate-500">Latest videos from our YouTube channel</p>
          <div className="mt-3 w-10 h-0.5 bg-[#F2B134]" />
        </div>
        <a
          href={channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-red-500 transition-colors pb-5"
        >
          <PlayCircle size={15} aria-hidden />
          Visit Channel
        </a>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 7 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : videos.length === 0 ? null : (
        <>
          {/* Featured + grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Featured video — large */}
            <div className="lg:col-span-2 lg:row-span-2">
              <VideoCard video={videos[0]} featured />
            </div>

            {/* Side videos */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {videos.slice(1, 3).map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
          </div>

          {/* Bottom row */}
          {videos.length > 3 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              {videos.slice(3, 7).map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Channel CTA */}
      {!loading && videos.length > 0 && (
        <div className="mt-6 text-center">
          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors"
          >
            <PlayCircle size={17} aria-hidden />
            Watch More on YouTube
          </a>
        </div>
      )}
    </section>
  );
}
