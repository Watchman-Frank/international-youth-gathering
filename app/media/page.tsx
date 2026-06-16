"use client";

import { useState, useEffect } from "react";
import { Image as ImageIcon, Video, Music, FileText, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MediaPost } from "@/app/api/admin/media-posts/route";

function fileCategory(type = "") {
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  if (type === "application/pdf") return "pdf";
  return "file";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

function CategoryIcon({ type, size = 20 }: { type?: string; size?: number }) {
  const cat = fileCategory(type);
  if (cat === "image") return <ImageIcon size={size} />;
  if (cat === "video") return <Video size={size} />;
  if (cat === "audio") return <Music size={size} />;
  return <FileText size={size} />;
}

export default function MediaGalleryPage() {
  const [posts, setPosts] = useState<MediaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "image" | "video" | "audio" | "pdf">("all");
  const [open, setOpen] = useState<MediaPost | null>(null);

  useEffect(() => {
    fetch("/api/media")
      .then((r) => r.json())
      .then(({ posts: p }) => setPosts(p ?? []))
      .finally(() => setLoading(false));
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const tabs: Array<{ key: typeof filter; label: string }> = [
    { key: "all", label: "All" },
    { key: "image", label: "Photos" },
    { key: "video", label: "Videos" },
    { key: "audio", label: "Audio" },
    { key: "pdf", label: "Documents" },
  ];

  const filtered = filter === "all" ? posts : posts.filter((p) => fileCategory(p.contentType) === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero */}
      <section>
        <div className="bg-gradient-to-br from-[#0D6B30] to-[#083D1C] rounded-3xl px-10 py-12 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#C8831A]/20 mb-4">
            <Video size={26} className="text-[#C8831A]" />
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold text-white text-balance"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Media Gallery
          </h1>
          <p className="text-white/70 mt-3 max-w-xl mx-auto text-base">
            Photos, videos, audio recordings and documents from IYG events, teachings and ministry moments.
          </p>
        </div>
      </section>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200",
              filter === key
                ? "bg-[#0D6B30] text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:border-[#0D6B30] hover:text-[#0D6B30]"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-slate-100">
          <Video size={40} className="text-slate-300 mx-auto mb-4" />
          <p className="text-lg font-semibold text-[#0D6B30]">
            {posts.length === 0 ? "No media yet" : "Nothing in this category"}
          </p>
          <p className="text-slate-400 mt-1 text-sm">
            {posts.length === 0 ? "Check back soon — content is coming!" : "Try a different filter above."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => {
            const cat = fileCategory(post.contentType);
            return (
              <article
                key={post.id}
                className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:shadow-green-900/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                onClick={() => setOpen(post)}
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-[#F0FAF3] relative overflow-hidden flex items-center justify-center">
                  {cat === "image" ? (
                    <img
                      src={post.fileUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : cat === "video" ? (
                    <>
                      <div className="flex flex-col items-center gap-3 text-[#0D6B30]/40">
                        <Video size={40} />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-[#0D6B30]/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Play size={22} className="text-white ml-1" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-[#0D6B30]/40">
                      <CategoryIcon type={post.contentType} size={40} />
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        {post.contentType?.split("/")[1]?.toUpperCase() ?? "FILE"}
                      </span>
                    </div>
                  )}

                  {/* Category badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0D6B30]/80 text-white">
                      <CategoryIcon type={post.contentType} size={10} />
                      {cat}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h2
                    className="font-bold text-[#0D6B30] text-base leading-snug group-hover:text-[#0A5423] transition-colors"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {post.title}
                  </h2>
                  {post.about && (
                    <p className="text-sm text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {post.about}
                    </p>
                  )}
                  <p className="text-xs text-[#C8831A] font-semibold mt-3">{formatDate(post.uploadedAt)}</p>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Lightbox / media viewer */}
      {open && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setOpen(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex-1 min-w-0 pr-4">
                <h3
                  className="text-lg font-bold text-[#0D6B30] leading-snug"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {open.title}
                </h3>
                {open.about && (
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{open.about}</p>
                )}
                <p className="text-xs text-[#C8831A] font-semibold mt-1">{formatDate(open.uploadedAt)}</p>
              </div>
              <button
                onClick={() => setOpen(null)}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Media content */}
            <div className="flex-1 overflow-auto flex items-center justify-center bg-slate-50 p-4 min-h-[300px]">
              {fileCategory(open.contentType) === "image" ? (
                <img
                  src={open.fileUrl}
                  alt={open.title}
                  className="max-w-full max-h-[65vh] object-contain rounded-xl"
                />
              ) : fileCategory(open.contentType) === "video" ? (
                <video
                  src={open.fileUrl}
                  controls
                  autoPlay
                  className="max-w-full max-h-[65vh] rounded-xl"
                />
              ) : fileCategory(open.contentType) === "audio" ? (
                <div className="text-center space-y-4 py-6">
                  <Music size={56} className="text-[#0D6B30]/30 mx-auto" />
                  <audio src={open.fileUrl} controls autoPlay className="w-full max-w-md" />
                </div>
              ) : (
                <div className="text-center space-y-3 py-8">
                  <FileText size={56} className="text-slate-300 mx-auto" />
                  <a
                    href={open.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0D6B30] text-white text-sm font-bold rounded-xl hover:bg-[#0A5423] transition-colors"
                  >
                    Open Document
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
