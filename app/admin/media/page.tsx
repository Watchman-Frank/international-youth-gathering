"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { upload } from "@vercel/blob/client";
import {
  Upload, Copy, Trash2, CheckCircle, AlertCircle,
  FileText, Music, Video, Image as ImageIcon, Loader2, X,
  Plus, ChevronDown, ChevronUp, Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MediaPost } from "@/app/api/admin/media-posts/route";

function fileCategory(type = "") {
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  if (type === "application/pdf") return "pdf";
  return "file";
}

function FileIcon({ type, size = 20 }: { type?: string; size?: number }) {
  const cat = fileCategory(type);
  if (cat === "image")  return <ImageIcon size={size} />;
  if (cat === "video")  return <Video size={size} />;
  if (cat === "audio")  return <Music size={size} />;
  return <FileText size={size} />;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

interface UploadState {
  file: File | null;
  title: string;
  about: string;
  progress: number;
  status: "idle" | "uploading" | "saving" | "done" | "error";
  error: string;
}

const INITIAL_UPLOAD: UploadState = {
  file: null, title: "", about: "", progress: 0,
  status: "idle", error: "",
};

export default function MediaPage() {
  const [posts, setPosts] = useState<MediaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [upload_, setUpload] = useState<UploadState>(INITIAL_UPLOAD);
  const [showForm, setShowForm] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "image" | "video" | "audio" | "pdf">("all");
  const [preview, setPreview] = useState<MediaPost | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media-posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  function handleFileSelect(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setUpload((u) => ({ ...u, file, title: u.title || file.name.replace(/\.[^.]+$/, "") }));
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { file, title, about } = upload_;
    if (!file || !title.trim()) return;

    setUpload((u) => ({ ...u, status: "uploading", progress: 0, error: "" }));

    try {
      const blob = await upload(
        `iyg/media/${Date.now()}-${file.name}`,
        file,
        {
          access: "public",
          handleUploadUrl: "/api/admin/upload",
          onUploadProgress: ({ percentage }) => {
            setUpload((u) => ({ ...u, progress: Math.round(percentage * 0.9) }));
          },
        }
      );

      setUpload((u) => ({ ...u, status: "saving", progress: 92 }));

      const metaRes = await fetch("/api/admin/media-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          about: about.trim(),
          fileUrl: blob.url,
          contentType: file.type,
          fileSize: file.size,
        }),
      });

      if (!metaRes.ok) {
        const err = await metaRes.json();
        throw new Error(err.error ?? "Failed to save post metadata");
      }

      setUpload((u) => ({ ...u, status: "done", progress: 100 }));
      await loadPosts();
      setTimeout(() => {
        setUpload(INITIAL_UPLOAD);
        setShowForm(false);
      }, 1500);
    } catch (err) {
      setUpload((u) => ({
        ...u,
        status: "error",
        error: err instanceof Error ? err.message : "Upload failed",
      }));
    }
  }

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  async function deletePost(id: string) {
    if (!confirm("Delete this media post and its file? This cannot be undone.")) return;
    setDeleting(id);
    await fetch("/api/admin/media-posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, deleteFile: true }),
    });
    await loadPosts();
    setDeleting(null);
  }

  const filtered = filter === "all"
    ? posts
    : posts.filter((p) => fileCategory(p.contentType) === filter);

  const filterTabs: Array<{ key: typeof filter; label: string }> = [
    { key: "all", label: "All" },
    { key: "image", label: "Images" },
    { key: "video", label: "Videos" },
    { key: "audio", label: "Audio" },
    { key: "pdf", label: "PDFs" },
  ];

  const isUploading = upload_.status === "uploading" || upload_.status === "saving";

  return (
    <div className="p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0D6B30]" style={{ fontFamily: "var(--font-display)" }}>
            Media Library
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {loading ? "Loading…" : `${posts.length} post${posts.length !== 1 ? "s" : ""} · Videos & images up to 2 GB`}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0D6B30] text-white text-sm font-bold rounded-lg hover:bg-[#0A5423] transition-colors"
        >
          {showForm ? <ChevronUp size={15} /> : <Plus size={15} />}
          {showForm ? "Cancel" : "New Post"}
        </button>
      </div>

      {/* Upload form */}
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
          <h2 className="text-base font-bold text-[#0D6B30] mb-5" style={{ fontFamily: "var(--font-display)" }}>
            Upload Media Post
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-[#0D6B30] mb-1.5">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={upload_.title}
                onChange={(e) => setUpload((u) => ({ ...u, title: e.target.value }))}
                placeholder="e.g. God-Life Conference Highlights 2025"
                required
                disabled={isUploading}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8831A] disabled:opacity-60"
              />
            </div>

            {/* About */}
            <div>
              <label className="block text-xs font-semibold text-[#0D6B30] mb-1.5">
                About this post
              </label>
              <textarea
                rows={3}
                value={upload_.about}
                onChange={(e) => setUpload((u) => ({ ...u, about: e.target.value }))}
                placeholder="Brief description of what this media contains…"
                disabled={isUploading}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#C8831A] disabled:opacity-60"
              />
            </div>

            {/* File picker */}
            <div>
              <label className="block text-xs font-semibold text-[#0D6B30] mb-1.5">
                File <span className="text-red-500">*</span>
              </label>
              <div
                ref={dragRef}
                onDragOver={(e) => { e.preventDefault(); dragRef.current?.classList.add("border-[#C8831A]", "bg-amber-50"); }}
                onDragLeave={() => dragRef.current?.classList.remove("border-[#C8831A]", "bg-amber-50")}
                onDrop={(e) => { e.preventDefault(); dragRef.current?.classList.remove("border-[#C8831A]", "bg-amber-50"); handleFileSelect(e.dataTransfer.files); }}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
                  upload_.file ? "border-[#0D6B30] bg-[#F0FAF3]" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                  isUploading && "pointer-events-none opacity-60"
                )}
              >
                {upload_.file ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileIcon type={upload_.file.type} size={22} />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-[#0D6B30] truncate max-w-xs">{upload_.file.name}</p>
                      <p className="text-xs text-slate-500">{formatBytes(upload_.file.size)}</p>
                    </div>
                    {!isUploading && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setUpload((u) => ({ ...u, file: null })); }}
                        className="ml-2 text-slate-400 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <Upload size={24} className="text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-600">Drag & drop or click to choose a file</p>
                    <p className="text-xs text-slate-400 mt-1">Images, Videos, Audio, PDFs · Max 2 GB</p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*,audio/*,.pdf"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
            </div>

            {/* Progress */}
            {(isUploading || upload_.status === "done") && (
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span>
                    {upload_.status === "uploading" && "Uploading…"}
                    {upload_.status === "saving" && "Saving post…"}
                    {upload_.status === "done" && "Posted!"}
                  </span>
                  <span>{upload_.progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      upload_.status === "done" ? "bg-green-500" : "bg-[#C8831A]"
                    )}
                    style={{ width: `${upload_.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error */}
            {upload_.status === "error" && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
                <AlertCircle size={15} />
                {upload_.error}
              </div>
            )}

            {/* Submit */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={!upload_.file || !upload_.title.trim() || isUploading || upload_.status === "done"}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#C8831A] text-white text-sm font-bold rounded-xl hover:bg-[#A56914] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                {upload_.status === "uploading" ? "Uploading…" : upload_.status === "saving" ? "Saving…" : upload_.status === "done" ? "Posted!" : "Upload & Publish"}
              </button>
              {upload_.status === "error" && (
                <button
                  type="button"
                  onClick={() => setUpload((u) => ({ ...u, status: "idle", error: "", progress: 0 }))}
                  className="text-sm text-slate-500 hover:text-slate-700"
                >
                  Try again
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6">
        {filterTabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-sm font-medium transition-colors",
              filter === key
                ? "bg-[#0D6B30] text-white"
                : "text-slate-500 hover:text-[#0D6B30] hover:bg-slate-100"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Posts grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-56 rounded-xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-100">
          <Upload size={32} className="text-slate-300 mx-auto mb-3" />
          <p className="font-semibold text-[#0D6B30] text-sm">
            {posts.length === 0 ? "No media posts yet" : "No posts in this category"}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {posts.length === 0
              ? 'Click "New Post" above to upload your first media.'
              : "Try a different filter."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((post) => {
            const cat = fileCategory(post.contentType);
            const isCopied = copied === post.fileUrl;
            const isDeleting = deleting === post.id;

            return (
              <div
                key={post.id}
                className="group relative bg-white rounded-xl border border-slate-100 overflow-hidden hover:border-slate-200 hover:shadow-md transition-all duration-200"
              >
                {/* Preview area */}
                <div className="aspect-video bg-slate-50 flex items-center justify-center overflow-hidden relative">
                  {cat === "image" ? (
                    <img
                      src={post.fileUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : cat === "video" ? (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Video size={36} className="text-[#0D6B30]/40" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Video</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <FileIcon type={post.contentType} size={36} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {post.contentType?.split("/")[1]?.toUpperCase() ?? "FILE"}
                      </span>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#0D6B30]/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPreview(post)}
                      title="Preview"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/20 text-white hover:bg-white/30 transition-colors"
                    >
                      <Eye size={12} /> Preview
                    </button>
                    <button
                      onClick={() => copyUrl(post.fileUrl)}
                      title="Copy URL"
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors",
                        isCopied ? "bg-green-500 text-white" : "bg-[#C8831A] text-white hover:bg-[#A56914]"
                      )}
                    >
                      {isCopied ? <CheckCircle size={12} /> : <Copy size={12} />}
                      {isCopied ? "Copied!" : "Copy URL"}
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      title="Delete"
                      disabled={isDeleting}
                      className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-red-500 transition-colors"
                    >
                      {isDeleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                    </button>
                  </div>
                </div>

                {/* Post info */}
                <div className="p-3 border-t border-slate-100">
                  <p className="text-sm font-semibold text-[#0D6B30] truncate" title={post.title}>
                    {post.title}
                  </p>
                  {post.about && (
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{post.about}</p>
                  )}
                  <p className="text-[10px] text-slate-400 mt-1.5">
                    {formatBytes(post.fileSize)} · {formatDate(post.uploadedAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-[#0D6B30]" style={{ fontFamily: "var(--font-display)" }}>
                  {preview.title}
                </h3>
                {preview.about && <p className="text-xs text-slate-500 mt-0.5">{preview.about}</p>}
              </div>
              <button onClick={() => setPreview(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="overflow-auto flex-1 flex items-center justify-center bg-slate-50 p-4">
              {fileCategory(preview.contentType) === "image" ? (
                <img src={preview.fileUrl} alt={preview.title} className="max-w-full max-h-[60vh] object-contain rounded-lg" />
              ) : fileCategory(preview.contentType) === "video" ? (
                <video src={preview.fileUrl} controls className="max-w-full max-h-[60vh] rounded-lg" />
              ) : fileCategory(preview.contentType) === "audio" ? (
                <audio src={preview.fileUrl} controls className="w-full" />
              ) : (
                <div className="text-center text-slate-500">
                  <FileText size={48} className="mx-auto mb-3 text-slate-300" />
                  <a href={preview.fileUrl} target="_blank" rel="noopener noreferrer" className="text-[#C8831A] underline text-sm">
                    Open file in new tab
                  </a>
                </div>
              )}
            </div>
            <div className="px-5 py-3 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={() => copyUrl(preview.fileUrl)}
                className="flex items-center gap-1.5 text-xs font-bold text-[#0D6B30] hover:text-[#C8831A] transition-colors"
              >
                <Copy size={12} />
                {copied === preview.fileUrl ? "Copied!" : "Copy URL"}
              </button>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-400">{formatBytes(preview.fileSize)}</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-400">{formatDate(preview.uploadedAt)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
