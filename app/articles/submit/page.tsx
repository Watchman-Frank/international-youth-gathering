"use client";

import { useState, useRef, useCallback } from "react";
import { ArrowLeft, CheckCircle2, Send, FileText, Upload, X, AlertCircle, Info } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const WORD_LIMIT = 150;

function countWords(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

const categories = [
  "Faith & Life",
  "Devotional",
  "Ministry",
  "Youth Culture",
  "Leadership",
  "Prayer",
  "Missions",
  "Testimony",
];

const MAX_PDF_MB = 10;
const MAX_PDF_BYTES = MAX_PDF_MB * 1024 * 1024;

interface PdfFile {
  file: File;
  name: string;
  sizeLabel: string;
  error?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function SubmitArticlePage() {
  const [submitted, setSubmitted] = useState(false);
  const [submissionType, setSubmissionType] = useState<"text" | "pdf" | "both">("text");
  const [summary, setSummary] = useState("");
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const incoming = Array.from(fileList).map((file) => {
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      const tooBig = file.size > MAX_PDF_BYTES;
      return {
        file,
        name: file.name,
        sizeLabel: formatBytes(file.size),
        error: !isPdf
          ? "Only PDF files are accepted."
          : tooBig
          ? `File exceeds the ${MAX_PDF_MB} MB limit.`
          : undefined,
      };
    });
    setPdfFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      return [...prev, ...incoming.filter((f) => !names.has(f.name))];
    });
  }, []);

  const removeFile = (name: string) =>
    setPdfFiles((prev) => prev.filter((f) => f.name !== name));

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hasValidPdf = pdfFiles.some((f) => !f.error);
    const needsPdf = submissionType === "pdf" || submissionType === "both";
    if (needsPdf && !hasValidPdf) {
      fileInputRef.current?.focus();
      return;
    }
    setSubmitted(true);
  };

  const showTextArea = submissionType === "text" || submissionType === "both";
  const showPdfUpload = submissionType === "pdf" || submissionType === "both";
  const validPdfs = pdfFiles.filter((f) => !f.error);

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
          <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#1B2A4A]" style={{ fontFamily: "var(--font-display)" }}>
            Submission Received!
          </h2>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            Thank you for contributing to the IYG community. Our editorial team will review your
            {validPdfs.length > 0 ? ` submission (including ${validPdfs.length} PDF${validPdfs.length > 1 ? "s" : ""})` : " article"} and contact you within 3–5 business days.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link
              href="/articles"
              className="px-5 py-2.5 bg-[#1B2A4A] text-white text-sm font-semibold rounded-xl hover:bg-[#2D4070] transition-colors"
            >
              Back to Articles
            </Link>
            <button
              onClick={() => { setSubmitted(false); setPdfFiles([]); }}
              className="px-5 py-2.5 border border-slate-200 text-[#1B2A4A] text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <Link
        href="/articles"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#1B2A4A] mb-8 transition-colors"
      >
        <ArrowLeft size={14} aria-hidden /> Back to Articles
      </Link>

      <h1
        className="text-3xl font-bold text-[#1B2A4A] mb-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Submit an Article
      </h1>
      <p className="text-slate-500 mb-8 text-sm leading-relaxed">
        Share your story, testimony, or ministry insight with the IYG community. You can type your
        article directly, upload a PDF, or both. Our editorial team will review your submission
        within 3–5 business days.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6" aria-label="Article submission form">
        {/* Name + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-[#1B2A4A] mb-1.5">
              Full Name <span aria-hidden className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              placeholder="Your full name"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134] focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-[#1B2A4A] mb-1.5">
              Email Address <span aria-hidden className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@email.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134] focus:border-transparent"
            />
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-[#1B2A4A] mb-1.5">
            Article Title <span aria-hidden className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            required
            placeholder="A compelling title for your article"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134] focus:border-transparent"
          />
        </div>

        {/* Category + Bio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-[#1B2A4A] mb-1.5">
              Category <span aria-hidden className="text-red-500">*</span>
            </label>
            <select
              id="category"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#F2B134] focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-semibold text-[#1B2A4A] mb-1.5">
              Short Bio <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              id="bio"
              type="text"
              placeholder="e.g. Youth pastor from Lagos"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134] focus:border-transparent"
            />
          </div>
        </div>

        {/* Submission type toggle */}
        <div>
          <p className="text-sm font-semibold text-[#1B2A4A] mb-2">
            How would you like to submit? <span aria-hidden className="text-red-500">*</span>
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Submission type">
            {(["text", "pdf", "both"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSubmissionType(type)}
                aria-pressed={submissionType === type}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-semibold border transition-all",
                  submissionType === type
                    ? "bg-[#1B2A4A] text-white border-[#1B2A4A]"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                )}
              >
                {type === "text" && "✍️ Type my article"}
                {type === "pdf" && "📄 Upload a PDF"}
                {type === "both" && "✍️ + 📄 Both"}
              </button>
            ))}
          </div>
        </div>

        {/* About the article — 150-word summary */}
        {showTextArea && (
          <div>
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <label htmlFor="body" className="block text-sm font-semibold text-[#1B2A4A]">
                About the Article{" "}
                {submissionType === "text" && <span aria-hidden className="text-red-500">*</span>}
              </label>
              <span
                className={cn(
                  "text-xs font-semibold tabular-nums flex-shrink-0 mt-0.5",
                  countWords(summary) > WORD_LIMIT ? "text-red-500" : "text-slate-400"
                )}
                aria-live="polite"
                aria-atomic="true"
              >
                {countWords(summary)} / {WORD_LIMIT} words
              </span>
            </div>

            {/* Helper tip */}
            <div className="flex items-start gap-2 mb-2 text-xs text-slate-500 bg-[#FAF8F3] border border-slate-200 rounded-xl px-3 py-2.5">
              <Info size={13} className="text-[#F2B134] mt-0.5 flex-shrink-0" aria-hidden />
              <span>
                Write a short summary of what your article is about — the key message, scripture
                focus, or main idea. Keep it under {WORD_LIMIT} words. Your full article goes in the
                PDF upload below.
              </span>
            </div>

            <textarea
              id="body"
              required={submissionType === "text"}
              rows={5}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="e.g. This article explores what it means to carry the Apostolic Mandate in the age of social media, drawing from Matthew 28 and real-life stories of young missionaries in West Africa…"
              className={cn(
                "w-full px-4 py-3 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 focus:border-transparent leading-relaxed transition-colors",
                countWords(summary) > WORD_LIMIT
                  ? "border-red-300 focus:ring-red-300"
                  : "border-slate-200 focus:ring-[#F2B134]"
              )}
              aria-describedby="body-count body-hint"
            />

            {countWords(summary) > WORD_LIMIT && (
              <p id="body-hint" className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                <AlertCircle size={12} aria-hidden />
                Over the {WORD_LIMIT}-word limit by {countWords(summary) - WORD_LIMIT} word{countWords(summary) - WORD_LIMIT !== 1 ? "s" : ""}. Please shorten your summary.
              </p>
            )}
          </div>
        )}

        {/* PDF Upload */}
        {showPdfUpload && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-semibold text-[#1B2A4A]">
                Upload PDF{submissionType === "both" ? " (optional supplement)" : ""}
                {submissionType === "pdf" && <span aria-hidden className="text-red-500"> *</span>}
              </label>
              <span className="text-xs text-slate-400">Max {MAX_PDF_MB} MB per file · PDF only</span>
            </div>

            {/* Drop zone */}
            <div
              role="button"
              tabIndex={0}
              aria-label="Upload PDF files — click or drag and drop"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={cn(
                "relative flex flex-col items-center justify-center gap-3 px-6 py-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all",
                dragging
                  ? "border-[#F2B134] bg-amber-50"
                  : "border-slate-200 bg-slate-50 hover:border-[#1B2A4A] hover:bg-[#FAF8F3]"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                dragging ? "bg-[#F2B134]" : "bg-white border border-slate-200"
              )}>
                <Upload
                  size={22}
                  className={dragging ? "text-[#1B2A4A]" : "text-slate-400"}
                  aria-hidden
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-[#1B2A4A]">
                  {dragging ? "Drop your PDF here" : "Click to browse or drag & drop"}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">PDF files only · up to {MAX_PDF_MB} MB each</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                multiple
                className="sr-only"
                aria-hidden
                onChange={(e) => addFiles(e.target.files)}
              />
            </div>

            {/* File list */}
            {pdfFiles.length > 0 && (
              <ul className="mt-3 space-y-2" aria-label="Attached PDF files">
                {pdfFiles.map(({ name, sizeLabel, error }) => (
                  <li
                    key={name}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl border text-sm",
                      error
                        ? "bg-red-50 border-red-200"
                        : "bg-white border-slate-200"
                    )}
                  >
                    {error ? (
                      <AlertCircle size={18} className="text-red-500 flex-shrink-0" aria-hidden />
                    ) : (
                      <FileText size={18} className="text-[#F2B134] flex-shrink-0" aria-hidden />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={cn("font-medium truncate", error ? "text-red-700" : "text-[#1B2A4A]")}>
                        {name}
                      </p>
                      {error ? (
                        <p className="text-xs text-red-500 mt-0.5">{error}</p>
                      ) : (
                        <p className="text-xs text-slate-400">{sizeLabel}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(name)}
                      aria-label={`Remove ${name}`}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Summary of valid files */}
            {validPdfs.length > 0 && (
              <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                <CheckCircle2 size={12} aria-hidden />
                {validPdfs.length} PDF{validPdfs.length > 1 ? "s" : ""} ready to submit
              </p>
            )}
          </div>
        )}

        {/* Featured image URL */}
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-semibold text-[#1B2A4A] mb-1.5">
            Featured Image URL <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            id="imageUrl"
            type="url"
            placeholder="https://…"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134] focus:border-transparent"
          />
          <p className="text-xs text-slate-400 mt-1.5">
            Link to a high-resolution image (1200 × 630 px recommended).
          </p>
        </div>

        {/* Legal */}
        <p className="text-xs text-slate-400 leading-relaxed">
          By submitting, you confirm that this is original content, you hold all rights to it, and
          you grant IYG permission to publish and promote it. Questions? Email{" "}
          <a
            href="mailto:info@internationalyouthgathering.com"
            className="text-[#1B2A4A] underline hover:text-[#F2B134] transition-colors"
          >
            info@internationalyouthgathering.com
          </a>
        </p>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#1B2A4A] text-white font-bold text-sm rounded-xl hover:bg-[#2D4070] transition-colors"
        >
          <Send size={16} aria-hidden />
          Submit for Review
        </button>
      </form>
    </div>
  );
}
