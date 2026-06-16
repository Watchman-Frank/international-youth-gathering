"use client";

import { useState, useEffect } from "react";
import { BookOpen, Calendar, Search, Clock, ChevronRight, Loader2, AlertCircle, Wifi } from "lucide-react";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import type { Devotional } from "@/lib/types";
import { formatDate, formatShortDate, formatDuration } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { YTVideo } from "@/lib/youtube";

/* ── Extract Bible reference from video title ─────── */
function extractScripture(title: string): { scripture: string; cleanTitle: string } {
  // Matches patterns like: "John 3:16", "1 Corinthians 13:4-7", "Psalm 23", "Gen 1:1"
  const match = title.match(
    /\b([1-3]?\s?(?:[A-Z][a-zA-Z]+\.?)\s+\d+(?::\d+(?:-\d+)?)?)\b/
  );
  if (!match) return { scripture: "", cleanTitle: title };
  const cleanTitle = title
    .replace(match[0], "")
    .replace(/^\s*[-|:·—]\s*|\s*[-|:·—]\s*$/g, "")
    .trim() || title;
  return { scripture: match[1].trim(), cleanTitle };
}

function mapToDevotional(video: YTVideo): Devotional {
  const { scripture, cleanTitle } = extractScripture(video.title);
  const summary = video.description?.split(/\n{2,}/)[0]?.slice(0, 320).trim() ?? "";
  return {
    id: video.id,
    title: cleanTitle || video.title,
    scripture: scripture || "Daily Word",
    thumbnailUrl:
      video.thumbnailUrl || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
    youtubeId: video.id,
    publishedAt: video.publishedAt,
    date: video.publishedAt,
    duration: video.duration ?? 0,
    summary: summary || undefined,
  };
}

/* ── Skeleton components ─────────────────────────── */
function PlayerSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm lg:sticky lg:top-20">
      <div className="skeleton aspect-video w-full" />
      <div className="p-5 sm:p-6 space-y-3">
        <div className="flex gap-2">
          <div className="skeleton h-6 w-24 rounded-full" />
          <div className="skeleton h-6 w-20 rounded-full" />
        </div>
        <div className="skeleton h-7 w-4/5 rounded-lg" />
        <div className="skeleton h-5 w-full rounded-lg" />
        <div className="skeleton h-5 w-3/4 rounded-lg" />
      </div>
    </div>
  );
}

function ArchiveSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-3 p-3 rounded-xl border border-slate-100">
          <div className="skeleton w-16 h-12 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="skeleton h-3 w-20 rounded" />
            <div className="skeleton h-4 w-full rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function WordForTheDayPage() {
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [selected, setSelected] = useState<Devotional | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<"fetch" | "unconfigured" | null>(null);

  useEffect(() => {
    fetch("/api/youtube/devotionals")
      .then((r) => r.json())
      .then((data) => {
        if (!data.configured) {
          setError("unconfigured");
          return;
        }
        if (data.error) {
          setError("fetch");
          return;
        }
        const mapped = (data.videos as YTVideo[]).map(mapToDevotional);
        setDevotionals(mapped);
        setSelected(mapped[0] ?? null);
      })
      .catch(() => setError("fetch"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = devotionals.filter(
    (d) =>
      !search ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      (d.scripture ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (d.summary ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
            <BookOpen size={20} className="text-amber-600" aria-hidden />
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold text-[#0D6B30]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Word for the Day
          </h1>
        </div>
        <p className="text-slate-500 text-base max-w-xl leading-relaxed">
          Daily devotional videos grounded in scripture — straight from our YouTube channel.
          Sign in to save progress and receive daily notifications.
        </p>
      </div>

      {/* Unconfigured notice */}
      {error === "unconfigured" && (
        <div className="mb-8 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm">
          <Wifi size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800">YouTube API key not set</p>
            <p className="text-amber-700 mt-0.5">
              Add your <code className="bg-amber-100 px-1 rounded">YOUTUBE_API_KEY</code> to{" "}
              <code className="bg-amber-100 px-1 rounded">.env.local</code> to auto-populate
              videos from your channel.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Player ──────────────────────────────── */}
        <div className="lg:col-span-2">
          {loading ? (
            <PlayerSkeleton />
          ) : error || !selected ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
              <AlertCircle size={36} className="text-slate-300 mx-auto mb-3" />
              <p className="font-semibold text-[#0D6B30]">No videos loaded</p>
              <p className="text-sm text-slate-400 mt-1">
                {error === "fetch"
                  ? "Could not reach YouTube. Check your API key and try again."
                  : "Configure your YouTube API key in .env.local to load videos automatically."}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm lg:sticky lg:top-20">
              <VideoPlayer
                youtubeId={selected.youtubeId}
                thumbnailUrl={selected.thumbnailUrl}
                title={selected.title}
              />
              <div className="p-5 sm:p-6">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {selected.scripture && selected.scripture !== "Daily Word" && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                      <BookOpen size={10} aria-hidden />
                      {selected.scripture}
                    </span>
                  )}
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar size={11} aria-hidden />
                    {formatDate(selected.date)}
                  </span>
                  {selected.duration > 0 && (
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={11} aria-hidden />
                      {formatDuration(selected.duration)}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2
                  className="text-xl font-bold text-[#0D6B30] leading-snug"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {selected.title}
                </h2>

                {/* Summary */}
                {selected.summary && (
                  <p className="text-sm text-slate-500 mt-3 leading-relaxed line-clamp-4">
                    {selected.summary}
                  </p>
                )}

                {/* Sign-in prompt */}
                <div className="mt-5 pt-5 border-t border-slate-100 flex items-center justify-between gap-4">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Sign in to track your progress and receive daily devotionals in your inbox.
                  </p>
                  <a
                    href="/sign-in"
                    className="flex-shrink-0 text-xs font-bold text-[#0D6B30] hover:text-[#C8831A] transition-colors flex items-center gap-1"
                  >
                    Sign in <ChevronRight size={12} aria-hidden />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Archive sidebar ──────────────────────── */}
        <div>
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                aria-hidden
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search devotionals…"
                aria-label="Search devotionals"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8831A] focus:border-transparent bg-white"
              />
            </div>
          </div>

          {loading ? (
            <ArchiveSkeleton />
          ) : (
            <div
              className="space-y-2 max-h-[600px] overflow-y-auto pr-1"
              role="list"
              aria-label="Devotional archive"
            >
              {filtered.map((d) => {
                const active = selected?.id === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => setSelected(d)}
                    role="listitem"
                    aria-pressed={active}
                    className={cn(
                      "w-full text-left flex gap-3 p-3 rounded-xl transition-all border",
                      active
                        ? "bg-[#0D6B30] border-[#0D6B30]"
                        : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm"
                    )}
                  >
                    <div className="relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden">
                      <img
                        src={d.thumbnailUrl}
                        alt=""
                        aria-hidden
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {active && (
                        <div className="absolute inset-0 bg-[#C8831A]/20 flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-[#C8831A]" aria-hidden />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-[10px] font-semibold uppercase tracking-wider mb-0.5",
                          active ? "text-[#C8831A]" : "text-slate-400"
                        )}
                      >
                        {d.scripture !== "Daily Word" ? d.scripture : "Daily Word"} ·{" "}
                        {formatShortDate(d.date)}
                      </p>
                      <h3
                        className={cn(
                          "text-sm font-semibold line-clamp-2 leading-snug",
                          active ? "text-white" : "text-[#0D6B30]"
                        )}
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {d.title}
                      </h3>
                    </div>
                  </button>
                );
              })}

              {!loading && filtered.length === 0 && (
                <div className="text-center py-10">
                  <BookOpen size={24} className="text-slate-300 mx-auto mb-2" aria-hidden />
                  <p className="text-sm text-slate-400">
                    {search ? "No devotionals match your search." : "No videos found on your channel yet."}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Live badge */}
          {!loading && !error && devotionals.length > 0 && (
            <p className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" aria-hidden />
              Live from{" "}
              <a
                href={`https://www.youtube.com/@${process.env.NEXT_PUBLIC_CHANNEL_HANDLE ?? "InternationalYouthGathering"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0D6B30] hover:text-[#C8831A] font-medium transition-colors"
              >
                @InternationalYouthGathering
              </a>{" "}
              · refreshes hourly
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
