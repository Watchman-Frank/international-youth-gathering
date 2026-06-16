"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import type { ArticleSubmission } from "@/app/api/submissions/route";
import { cn } from "@/lib/utils";

type Tab = "pending" | "approved" | "rejected";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function SubmissionCard({ sub, onReview }: { sub: ArticleSubmission; onReview: (id: string, action: "approve" | "reject", comment: string) => Promise<void> }) {
  const [expanded, setExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [action, setAction] = useState<"approve" | "reject">("approve");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    await onReview(sub.id, action, comment);
    setLoading(false);
    setShowForm(false);
    setComment("");
  }

  const statusColors: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    approved: "bg-green-50 text-green-700 border-green-100",
    rejected: "bg-red-50 text-red-700 border-red-100",
  };
  const StatusIcon = sub.status === "approved" ? CheckCircle : sub.status === "rejected" ? XCircle : Clock;

  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn("inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border", statusColors[sub.status])}>
                <StatusIcon size={11} />{sub.status}
              </span>
              <span className="text-[11px] text-slate-400">{formatDate(sub.submittedAt)}</span>
              <span className="text-[11px] font-semibold text-[#F2B134] bg-[#F2B134]/10 px-2 py-0.5 rounded-full">{sub.category}</span>
            </div>
            <h3 className="font-bold text-[#1B2A4A] mt-2 leading-snug" style={{ fontFamily: "var(--font-display)" }}>{sub.title}</h3>
            <p className="text-xs text-slate-500 mt-1">by <strong>{sub.authorName}</strong> · {sub.authorEmail}</p>
          </div>
          <button onClick={() => setExpanded(!expanded)} className="text-slate-400 hover:text-[#1B2A4A] transition-colors flex-shrink-0">
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-600 leading-relaxed">{sub.excerpt}</p>
            {sub.reviewComment && (
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Review Comment</p>
                <p className="text-sm text-slate-600">{sub.reviewComment}</p>
                {sub.reviewedAt && <p className="text-xs text-slate-400 mt-1">Reviewed {formatDate(sub.reviewedAt)}</p>}
              </div>
            )}
          </div>
        )}
      </div>

      {sub.status === "pending" && (
        <div className="px-5 pb-5">
          {!showForm ? (
            <div className="flex gap-2">
              <button onClick={() => { setAction("approve"); setShowForm(true); }} className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                <CheckCircle size={14} />Accept
              </button>
              <button onClick={() => { setAction("reject"); setShowForm(true); }} className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors">
                <XCircle size={14} />Reject
              </button>
            </div>
          ) : (
            <div className="border border-slate-100 rounded-xl p-4 space-y-3 bg-slate-50">
              <div className="flex gap-2">
                {(["approve", "reject"] as const).map((a) => (
                  <button key={a} type="button" onClick={() => setAction(a)}
                    className={cn("px-3 py-1.5 text-xs font-bold rounded-lg border transition-all capitalize", action === a ? (a === "approve" ? "bg-green-600 text-white border-green-600" : "bg-red-500 text-white border-red-500") : "bg-white text-slate-600 border-slate-200")}>
                    {a}
                  </button>
                ))}
              </div>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} placeholder={action === "approve" ? "Optional note to author…" : "Reason for rejection (will be shared with author)…"}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134] resize-none" />
              <div className="flex gap-2">
                <button onClick={submit} disabled={loading} className={cn("flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white rounded-lg transition-colors disabled:opacity-60", action === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600")}>
                  {loading && <span className="h-3 w-3 rounded-full border border-white/30 border-t-white animate-spin" />}
                  Confirm {action === "approve" ? "Acceptance" : "Rejection"}
                </button>
                <button onClick={() => { setShowForm(false); setComment(""); }} className="px-4 py-2 text-sm text-slate-500 border border-slate-200 rounded-lg hover:bg-white transition-colors">Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminSubmissionsPage() {
  const [tab, setTab] = useState<Tab>("pending");
  const [submissions, setSubmissions] = useState<ArticleSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/submissions");
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions ?? []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleReview(id: string, action: "approve" | "reject", comment: string) {
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, comment }),
    });
    if (res.ok) { await load(); }
  }

  const filtered = submissions.filter((s) => s.status === tab);
  const pendingCount = submissions.filter((s) => s.status === "pending").length;

  const tabs: { key: Tab; label: string }[] = [
    { key: "pending", label: `Pending${pendingCount > 0 ? ` (${pendingCount})` : ""}` },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#1B2A4A]" style={{ fontFamily: "var(--font-display)" }}>Article Submissions</h1>
          <p className="text-sm text-slate-500 mt-1">Review, accept, or reject submitted articles and research papers.</p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <RefreshCw size={14} />Refresh
        </button>
      </div>

      {pendingCount > 0 && (
        <div className="mb-5 flex items-center gap-2.5 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 font-medium">
          <Clock size={16} className="text-amber-500" />
          {pendingCount} submission{pendingCount !== 1 ? "s" : ""} awaiting your review.
        </div>
      )}

      <div className="flex gap-1 mb-6 border-b border-slate-100">
        {tabs.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)} className={cn("px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px", tab === key ? "border-[#F2B134] text-[#1B2A4A]" : "border-transparent text-slate-400 hover:text-slate-600")}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
          <p className="text-sm text-slate-400">No {tab} submissions.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((s) => <SubmissionCard key={s.id} sub={s} onReview={handleReview} />)}
        </div>
      )}
    </div>
  );
}
