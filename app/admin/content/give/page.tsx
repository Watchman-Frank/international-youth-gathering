"use client";

import { useEffect, useState } from "react";
import { Save, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import type { SiteContent } from "@/app/api/admin/content/route";

type GiveContent = NonNullable<SiteContent["give"]>;

export default function AdminContentGivePage() {
  const [form, setForm] = useState<GiveContent>({
    heroTitle: "",
    heroSubtitle: "",
    bankDetails: "",
    paypalLink: "",
    cashappLink: "",
    additionalGiveText: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then(({ content }: { content: SiteContent }) => {
        if (content?.give) setForm({ ...form, ...content.give });
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ give: form }),
      });
      if (!res.ok) {
        const d = await res.json();
        setErrorMsg(d.error ?? "Save failed");
        setStatus("error");
      } else {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch {
      setErrorMsg("Network error");
      setStatus("error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[40vh]">
        <Loader2 size={24} className="animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0D6B30]">Edit Give / Support Page</h1>
        <p className="text-sm text-slate-500 mt-1">
          Update payment details, links, and messaging shown on the Give page. Leave blank to use built-in defaults.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-[#0D6B30] mb-1.5">Page Title</label>
          <input
            type="text"
            value={form.heroTitle ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, heroTitle: e.target.value }))}
            placeholder="e.g. Partner With the Mission"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8831A]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#0D6B30] mb-1.5">Page Subtitle / Description</label>
          <textarea
            rows={3}
            value={form.heroSubtitle ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, heroSubtitle: e.target.value }))}
            placeholder="Short description of why giving matters to IYG"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#C8831A]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#0D6B30] mb-1.5">Bank / Wire Transfer Details</label>
          <textarea
            rows={5}
            value={form.bankDetails ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, bankDetails: e.target.value }))}
            placeholder={`Bank Name: First National Bank\nAccount Name: International Youth Gathering\nAccount Number: 000-000-0000\nRouting Number: 000000000\nSWIFT Code: FNBAUS33`}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#C8831A] font-mono"
          />
          <p className="text-xs text-slate-400 mt-1">Shown in a formatted block on the Give page.</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#0D6B30] mb-1.5">PayPal Link</label>
          <input
            type="url"
            value={form.paypalLink ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, paypalLink: e.target.value }))}
            placeholder="https://paypal.me/iyg"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8831A]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#0D6B30] mb-1.5">Cash App / Other Link</label>
          <input
            type="url"
            value={form.cashappLink ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, cashappLink: e.target.value }))}
            placeholder="https://cash.app/$iyg"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8831A]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#0D6B30] mb-1.5">Additional Give Text</label>
          <textarea
            rows={4}
            value={form.additionalGiveText ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, additionalGiveText: e.target.value }))}
            placeholder="Any extra instructions, tax info, or thank-you message for donors"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#C8831A]"
          />
        </div>

        {status === "error" && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle size={14} /> {errorMsg}
          </div>
        )}
        {status === "success" && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle size={14} /> Give page content saved!
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-[#C8831A] text-[#0D6B30] font-bold text-sm rounded-xl hover:bg-[#A56914] transition-colors disabled:opacity-60"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? "Saving…" : "Save Give Content"}
        </button>
      </form>
    </div>
  );
}
