"use client";

import { useState, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, CheckCircle2, Send, FileText, Upload, X, AlertCircle, Info, Lock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const WORD_LIMIT = 150;
function countWords(text: string) { return text.trim() === "" ? 0 : text.trim().split(/\s+/).length; }

const categories = ["Faith & Life", "Devotional", "Ministry", "Youth Culture", "Leadership", "Prayer", "Missions", "Testimony"];
const MAX_PDF_MB = 10;
const MAX_PDF_BYTES = MAX_PDF_MB * 1024 * 1024;

interface PdfFile { file: File; name: string; sizeLabel: string; error?: string; }
function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

export default function SubmitArticlePage() {
  const { data: session, status } = useSession();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submissionType, setSubmissionType] = useState<"text" | "pdf" | "both">("text");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [summary, setSummary] = useState("");
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const incoming = Array.from(fileList).map((file) => {
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      const tooBig = file.size > MAX_PDF_BYTES;
      return { file, name: file.name, sizeLabel: formatBytes(file.size), error: !isPdf ? "Only PDF files are accepted." : tooBig ? `File exceeds the ${MAX_PDF_MB} MB limit.` : undefined };
    });
    setPdfFiles((prev) => { const names = new Set(prev.map((f) => f.name)); return [...prev, ...incoming.filter((f) => !names.has(f.name))]; });
  }, []);

  const removeFile = (name: string) => setPdfFiles((prev) => prev.filter((f) => f.name !== name));
  const onDrop = (e: React.DragEvent) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); };

  const validPdfs = pdfFiles.filter((f) => !f.error);
  const showTextArea = submissionType === "text" || submissionType === "both";
  const showPdfUpload = submissionType === "pdf" || submissionType === "both";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const needsPdf = submissionType === "pdf" || submissionType === "both";
    if (needsPdf && validPdfs.length === 0) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, excerpt: summary.slice(0, 300), body: summary, category, tags: [] }),
      });
      if (!res.ok) {
        const data = await res.json();
        setSubmitError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Not signed in
  if (status !== "loading" && !session) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#1B2A4A]/10 flex items-center justify-center mx-auto mb-5">
          <Lock size={28} className="text-[#1B2A4A]" />
        </div>
        <h1 className="text-2xl font-bold text-[#1B2A4A] mb-2" style={{ fontFamily: "var(--font-display)" }}>
          Sign In to Submit
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-6">
          You need an IYG account to submit articles or research papers for review.
          Your profile will be associated with your submission.
        </p>
        <Link
          href="/sign-in?callbackUrl=/articles/submit"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1B2A4A] text-white text-sm font-bold rounded-xl hover:bg-[#2D4070] transition-colors"
        >
          Sign In / Create Account
        </Link>
        <div className="mt-4">
          <Link href="/articles" className="text-sm text-slate-500 hover:text-[#1B2A4A]">
            ← Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
          <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#1B2A4A]" style={{ fontFamily: "var(--font-display)" }}>Submission Received!</h2>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            Thank you for contributing to the IYG community. Our editorial team will review your submission and notify you within 3–5 business days.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link href="/articles" className="px-5 py-2.5 bg-[#1B2A4A] text-white text-sm font-semibold rounded-xl hover:bg-[#2D4070] transition-colors">
              Back to Articles
            </Link>
            <button onClick={() => { setSubmitted(false); setPdfFiles([]); setTitle(""); setSummary(""); setCategory(""); }} className="px-5 py-2.5 border border-slate-200 text-[#1B2A4A] text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors">
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/articles" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#1B2A4A] mb-8 transition-colors">
        <ArrowLeft size={14} aria-hidden /> Back to Articles
      </Link>

      {/* Author identity (from session) */}
      <div className="flex items-center gap-3 mb-6 p-4 bg-[#FAF8F3] rounded-xl border border-slate-100">
        {session?.user?.image && (
          <img src={session.user.image} alt="" className="w-10 h-10 rounded-full object-cover" />
        )}
        <div>
          <p className="text-sm font-bold text-[#1B2A4A]">{session?.user?.name}</p>
          <p className="text-xs text-slate-500">{session?.user?.email}</p>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-[#1B2A4A] mb-2" style={{ fontFamily: "var(--font-display)" }}>Submit an Article</h1>
      <p className="text-slate-500 mb-8 text-sm leading-relaxed">
        Share your story, testimony, or ministry insight with the IYG community. Our editorial team will review your submission within 3–5 business days.
      </p>

      {submitError && (
        <div className="flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700 mb-5">
          <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-[#1B2A4A] mb-1.5">Article Title <span className="text-red-500">*</span></label>
          <input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="A compelling title for your article" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134]" />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-[#1B2A4A] mb-1.5">Category <span className="text-red-500">*</span></label>
          <select id="category" required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#F2B134]">
            <option value="">Select a category</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <p className="text-sm font-semibold text-[#1B2A4A] mb-2">How would you like to submit? <span className="text-red-500">*</span></p>
          <div className="flex flex-wrap gap-2">
            {(["text", "pdf", "both"] as const).map((type) => (
              <button key={type} type="button" onClick={() => setSubmissionType(type)} aria-pressed={submissionType === type}
                className={cn("px-4 py-2 rounded-xl text-sm font-semibold border transition-all", submissionType === type ? "bg-[#1B2A4A] text-white border-[#1B2A4A]" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300")}>
                {type === "text" && "✍️ Type my article"}{type === "pdf" && "📄 Upload a PDF"}{type === "both" && "✍️ + 📄 Both"}
              </button>
            ))}
          </div>
        </div>

        {showTextArea && (
          <div>
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <label htmlFor="body" className="block text-sm font-semibold text-[#1B2A4A]">Article Summary {submissionType === "text" && <span className="text-red-500">*</span>}</label>
              <span className={cn("text-xs font-semibold tabular-nums flex-shrink-0 mt-0.5", countWords(summary) > WORD_LIMIT ? "text-red-500" : "text-slate-400")}>{countWords(summary)} / {WORD_LIMIT} words</span>
            </div>
            <div className="flex items-start gap-2 mb-2 text-xs text-slate-500 bg-[#FAF8F3] border border-slate-200 rounded-xl px-3 py-2.5">
              <Info size={13} className="text-[#F2B134] mt-0.5 flex-shrink-0" />
              <span>Write a short summary of your article — the key message, scripture focus, or main idea. Keep it under {WORD_LIMIT} words.</span>
            </div>
            <textarea id="body" required={submissionType === "text"} rows={5} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="e.g. This article explores what it means to carry the Apostolic Mandate in the age of social media…" className={cn("w-full px-4 py-3 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 focus:border-transparent leading-relaxed", countWords(summary) > WORD_LIMIT ? "border-red-300 focus:ring-red-300" : "border-slate-200 focus:ring-[#F2B134]")} />
            {countWords(summary) > WORD_LIMIT && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle size={12} />Over the word limit by {countWords(summary) - WORD_LIMIT} word{countWords(summary) - WORD_LIMIT !== 1 ? "s" : ""}.</p>}
          </div>
        )}

        {showPdfUpload && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-semibold text-[#1B2A4A]">Upload PDF{submissionType === "both" ? " (optional)" : ""}{submissionType === "pdf" && <span className="text-red-500"> *</span>}</label>
              <span className="text-xs text-slate-400">Max {MAX_PDF_MB} MB · PDF only</span>
            </div>
            <div role="button" tabIndex={0} onClick={() => fileInputRef.current?.click()} onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()} onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop}
              className={cn("flex flex-col items-center justify-center gap-3 px-6 py-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all", dragging ? "border-[#F2B134] bg-amber-50" : "border-slate-200 bg-slate-50 hover:border-[#1B2A4A] hover:bg-[#FAF8F3]")}>
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", dragging ? "bg-[#F2B134]" : "bg-white border border-slate-200")}>
                <Upload size={22} className={dragging ? "text-[#1B2A4A]" : "text-slate-400"} />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-[#1B2A4A]">{dragging ? "Drop your PDF here" : "Click to browse or drag & drop"}</p>
                <p className="text-xs text-slate-400 mt-0.5">PDF files only · up to {MAX_PDF_MB} MB each</p>
              </div>
              <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" multiple className="sr-only" onChange={(e) => addFiles(e.target.files)} />
            </div>
            {pdfFiles.length > 0 && (
              <ul className="mt-3 space-y-2">
                {pdfFiles.map(({ name, sizeLabel, error }) => (
                  <li key={name} className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border text-sm", error ? "bg-red-50 border-red-200" : "bg-white border-slate-200")}>
                    {error ? <AlertCircle size={18} className="text-red-500 flex-shrink-0" /> : <FileText size={18} className="text-[#F2B134] flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className={cn("font-medium truncate", error ? "text-red-700" : "text-[#1B2A4A]")}>{name}</p>
                      {error ? <p className="text-xs text-red-500 mt-0.5">{error}</p> : <p className="text-xs text-slate-400">{sizeLabel}</p>}
                    </div>
                    <button type="button" onClick={() => removeFile(name)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"><X size={14} /></button>
                  </li>
                ))}
              </ul>
            )}
            {validPdfs.length > 0 && <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1"><CheckCircle2 size={12} />{validPdfs.length} PDF{validPdfs.length > 1 ? "s" : ""} ready</p>}
          </div>
        )}

        <p className="text-xs text-slate-400 leading-relaxed">By submitting, you confirm this is original content and grant IYG permission to publish it.</p>

        <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#1B2A4A] text-white font-bold text-sm rounded-xl hover:bg-[#2D4070] transition-colors disabled:opacity-60">
          {submitting && <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
          <Send size={16} />
          Submit for Review
        </button>
      </form>
    </div>
  );
}
