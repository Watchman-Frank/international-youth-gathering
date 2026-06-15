"use client";

import { useState, useEffect } from "react";
import { Play, Loader2, AlertCircle, Calendar, Wifi } from "lucide-react";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { YTVideo } from "@/lib/youtube";

function SessionSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
        <div className="skeleton aspect-video w-full" />
        <div className="p-5 space-y-3">
          <div className="skeleton h-6 w-3/4 rounded-lg" />
          <div className="skeleton h-4 w-32 rounded" />
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-5/6 rounded" />
        </div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-3 p-3 rounded-xl border border-slate-100">
            <div className="skeleton w-20 h-14 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-3 w-24 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PastConferenceSessions() {
  const [videos, setVideos] = useState<YTVideo[]>([]);
  const [selected, setSelected] = useState<YTVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<"fetch" | "unconfigured" | null>(null);

  useEffect(() => {
    fetch("/api/youtube/conference")
      .then((r) => r.json())
      .then((data) => {
        if (!data.configured) { setError("unconfigured"); return; }
        if (data.error)       { setError("fetch"); return; }
        const v = data.videos as YTVideo[];
        setVideos(v);
        setSelected(v[0] ?? null);
      })
      .catch(() => setError("fetch"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <SessionSkeleton />;

  if (error === "unconfigured") {
    return (
      <div className="flex items-start gap-3 p-5 bg-amber-50 border border-amber-200 rounded-2xl text-sm">
        <Wifi size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800">YouTube API key not configured</p>
          <p className="text-amber-700 mt-0.5">
            Add <code className="bg-amber-100 px-1 rounded">YOUTUBE_API_KEY</code> to{" "}
            <code className="bg-amber-100 px-1 rounded">.env.local</code> — conference recordings
            from your channel will appear here automatically.
          </p>
        </div>
      </div>
    );
  }

  if (error || !videos.length) {
    return (
      <div className="text-center py-16 bg-[#FAF8F3] rounded-2xl border border-slate-100">
        <AlertCircle size={32} className="text-slate-300 mx-auto mb-3" />
        <p className="font-semibold text-[#1B2A4A] text-sm">
          {error ? "Could not load recordings" : "No conference recordings yet"}
        </p>
        <p className="text-xs text-slate-400 mt-1">
          {error
            ? "Check your API key or try again later."
            : "Recordings from past God-Life Conferences will appear here automatically after the event."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main player */}
      <div className="lg:col-span-2">
        {selected && (
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
            <VideoPlayer
              youtubeId={selected.id}
              thumbnailUrl={selected.thumbnailUrl}
              title={selected.title}
            />
            <div className="p-5">
              <h3
                className="font-bold text-[#1B2A4A] text-lg leading-snug"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {selected.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <Calendar size={11} aria-hidden />
                {formatDate(selected.publishedAt)}
              </p>
              {selected.description && (
                <p className="text-sm text-slate-500 mt-2.5 leading-relaxed line-clamp-3">
                  {selected.description}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Session list */}
      <div
        className="space-y-2 max-h-[560px] overflow-y-auto pr-1"
        role="list"
        aria-label="Conference session recordings"
      >
        {videos.map((v) => {
          const active = selected?.id === v.id;
          return (
            <button
              key={v.id}
              onClick={() => setSelected(v)}
              role="listitem"
              aria-pressed={active}
              className={cn(
                "w-full text-left flex gap-3 p-3 rounded-xl border transition-all duration-200",
                active
                  ? "bg-[#1B2A4A] border-[#1B2A4A]"
                  : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm"
              )}
            >
              {/* Thumbnail */}
              <div className="relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden">
                <img
                  src={v.thumbnailUrl}
                  alt=""
                  aria-hidden
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className={cn(
                  "absolute inset-0 flex items-center justify-center",
                  active ? "bg-[#F2B134]/25" : "bg-black/30"
                )}>
                  <Play
                    size={14}
                    className={active ? "text-[#F2B134]" : "text-white"}
                    fill="currentColor"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-semibold line-clamp-2 leading-snug",
                    active ? "text-white" : "text-[#1B2A4A]"
                  )}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {v.title}
                </p>
                <p className={cn("text-xs mt-1", active ? "text-white/50" : "text-slate-400")}>
                  {formatDate(v.publishedAt)}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Live indicator */}
      <div className="lg:col-span-3">
        <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" aria-hidden />
          Auto-populated from{" "}
          <a
            href="https://www.youtube.com/@InternationalYouthGathering"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1B2A4A] hover:text-[#F2B134] font-medium transition-colors"
          >
            @InternationalYouthGathering
          </a>{" "}
          · refreshes hourly
        </p>
      </div>
    </div>
  );
}
