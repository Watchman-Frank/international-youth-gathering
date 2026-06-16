"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Upload, Copy, Trash2, CheckCircle, AlertCircle,
  FileText, Music, Video, Image as ImageIcon, Loader2, X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BlobFile {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
  contentType?: string;
}

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
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
  error?: string;
  done?: boolean;
}

export default function MediaPage() {
  const [blobs, setBlobs] = useState<BlobFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [filter, setFilter] = useState<"all" | "image" | "video" | "audio" | "pdf">("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      if (res.ok) {
        const data = await res.json();
        setBlobs(data.blobs ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadMedia(); }, [loadMedia]);

  async function uploadFile(file: File) {
    const id = `${Date.now()}-${file.name}`;
    setUploading((u) => [...u, { id, name: file.name, progress: 10 }]);

    const form = new FormData();
    form.append("file", file);

    try {
      // Simulate progress — XHR for real progress would require more setup
      setUploading((u) => u.map((f) => f.id === id ? { ...f, progress: 40 } : f));
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      setUploading((u) => u.map((f) => f.id === id ? { ...f, progress: 90 } : f));

      if (!res.ok) {
        const err = await res.json();
        setUploading((u) => u.map((f) => f.id === id ? { ...f, error: err.error ?? "Upload failed" } : f));
        return;
      }

      setUploading((u) => u.map((f) => f.id === id ? { ...f, progress: 100, done: true } : f));
      await loadMedia();
      setTimeout(() => setUploading((u) => u.filter((f) => f.id !== id)), 2000);
    } catch {
      setUploading((u) => u.map((f) => f.id === id ? { ...f, error: "Network error" } : f));
    }
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach(uploadFile);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  async function deleteFile(url: string) {
    if (!confirm("Delete this file? This cannot be undone.")) return;
    setDeleting(url);
    await fetch("/api/admin/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    await loadMedia();
    setDeleting(null);
  }

  const filtered = filter === "all"
    ? blobs
    : blobs.filter((b) => fileCategory(b.contentType) === filter);

  const filterTabs: Array<{ key: typeof filter; label: string }> = [
    { key: "all", label: "All" },
    { key: "image", label: "Images" },
    { key: "video", label: "Videos" },
    { key: "audio", label: "Audio" },
    { key: "pdf", label: "PDFs" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0D6B30]" style={{ fontFamily: "var(--font-display)" }}>
            Media Library
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {loading ? "Loading…" : `${blobs.length} file${blobs.length !== 1 ? "s" : ""} uploaded`}
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0D6B30] text-white text-sm font-bold rounded-lg hover:bg-[#0A5423] transition-colors"
        >
          <Upload size={15} aria-hidden />
          Upload Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*,.pdf"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors mb-8",
          dragOver
            ? "border-[#C8831A] bg-amber-50"
            : "border-slate-200 hover:border-slate-300 hover:bg-white"
        )}
      >
        <Upload size={28} className={cn("mx-auto mb-3", dragOver ? "text-[#C8831A]" : "text-slate-400")} aria-hidden />
        <p className="text-sm font-semibold text-slate-600">
          {dragOver ? "Drop files here" : "Drag & drop files here"}
        </p>
        <p className="text-xs text-slate-400 mt-1">
          or click to browse — Images, Videos, Audio, PDFs · Max 50 MB each
        </p>
      </div>

      {/* Active uploads */}
      {uploading.length > 0 && (
        <div className="mb-8 space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Uploading</p>
          {uploading.map((f) => (
            <div key={f.id} className="bg-white rounded-lg border border-slate-100 p-4 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0D6B30] truncate">{f.name}</p>
                {f.error ? (
                  <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
                    <AlertCircle size={11} /> {f.error}
                  </p>
                ) : (
                  <div className="mt-1.5 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C8831A] rounded-full transition-all duration-300"
                      style={{ width: `${f.progress}%` }}
                    />
                  </div>
                )}
              </div>
              {f.done && <CheckCircle size={18} className="text-green-500 flex-shrink-0" />}
              {f.error && (
                <button onClick={() => setUploading((u) => u.filter((x) => x.id !== f.id))} className="text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              )}
              {!f.done && !f.error && <Loader2 size={18} className="text-slate-400 flex-shrink-0 animate-spin" />}
            </div>
          ))}
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

      {/* File grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl skeleton" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-100">
          <Upload size={32} className="text-slate-300 mx-auto mb-3" aria-hidden />
          <p className="font-semibold text-[#0D6B30] text-sm">
            {blobs.length === 0 ? "No files uploaded yet" : "No files in this category"}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {blobs.length === 0
              ? "Drag and drop files above or click Upload Files to get started."
              : "Try a different filter."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((blob) => {
            const cat = fileCategory(blob.contentType);
            const name = blob.pathname.replace("iyg/", "").replace(/^\d+-/, "");
            const isCopied = copied === blob.url;

            return (
              <div
                key={blob.url}
                className="group relative bg-white rounded-xl border border-slate-100 overflow-hidden hover:border-slate-200 hover:shadow-md transition-all duration-200"
              >
                {/* Preview */}
                <div className="aspect-square bg-slate-50 flex items-center justify-center overflow-hidden">
                  {cat === "image" ? (
                    <img
                      src={blob.url}
                      alt={name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <FileIcon type={blob.contentType} size={32} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {blob.contentType?.split("/")[1]?.toUpperCase() ?? "FILE"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions overlay */}
                <div className="absolute inset-0 bg-[#0D6B30]/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => copyUrl(blob.url)}
                    title="Copy URL"
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors",
                      isCopied
                        ? "bg-green-500 text-white"
                        : "bg-[#C8831A] text-[#0D6B30] hover:bg-[#A56914]"
                    )}
                  >
                    {isCopied ? <CheckCircle size={13} /> : <Copy size={13} />}
                    {isCopied ? "Copied!" : "Copy URL"}
                  </button>
                  <button
                    onClick={() => deleteFile(blob.url)}
                    title="Delete file"
                    disabled={deleting === blob.url}
                    className="p-2 rounded-lg bg-white/15 text-white hover:bg-red-500 transition-colors"
                  >
                    {deleting === blob.url
                      ? <Loader2 size={14} className="animate-spin" />
                      : <Trash2 size={14} />}
                  </button>
                </div>

                {/* File info */}
                <div className="p-3 border-t border-slate-100">
                  <p className="text-xs font-medium text-[#0D6B30] truncate" title={name}>{name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {formatBytes(blob.size)} · {formatDate(blob.uploadedAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
