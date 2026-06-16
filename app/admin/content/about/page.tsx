"use client";

import { useEffect, useState } from "react";
import { Save, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import type { SiteContent } from "@/app/api/admin/content/route";

type AboutContent = NonNullable<SiteContent["about"]>;

export default function AdminContentAboutPage() {
  const [form, setForm] = useState<AboutContent>({
    heroTitle: "",
    heroSubtitle: "",
    missionStatement: "",
    visionStatement: "",
    additionalText: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then(({ content }: { content: SiteContent }) => {
        if (content?.about) setForm({ ...form, ...content.about });
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
        body: JSON.stringify({ about: form }),
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
        <h1 className="text-2xl font-bold text-[#1B2A4A]">Edit About IYG</h1>
        <p className="text-sm text-slate-500 mt-1">
          These fields override the default About page content. Leave blank to use the built-in defaults.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-[#1B2A4A] mb-1.5">Page Hero Title</label>
          <input
            type="text"
            value={form.heroTitle ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, heroTitle: e.target.value }))}
            placeholder="e.g. About International Youth Gathering"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1B2A4A] mb-1.5">Hero Subtitle</label>
          <textarea
            rows={2}
            value={form.heroSubtitle ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, heroSubtitle: e.target.value }))}
            placeholder="A brief tagline shown under the main title"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#F2B134]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1B2A4A] mb-1.5">Mission Statement</label>
          <textarea
            rows={4}
            value={form.missionStatement ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, missionStatement: e.target.value }))}
            placeholder="IYG's mission statement — displayed prominently on the About page"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#F2B134]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1B2A4A] mb-1.5">Vision Statement</label>
          <textarea
            rows={4}
            value={form.visionStatement ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, visionStatement: e.target.value }))}
            placeholder="IYG's vision — where God is taking the ministry"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#F2B134]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1B2A4A] mb-1.5">Additional Text</label>
          <textarea
            rows={5}
            value={form.additionalText ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, additionalText: e.target.value }))}
            placeholder="Any extra paragraphs or background information about IYG"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#F2B134]"
          />
        </div>

        {status === "error" && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle size={14} /> {errorMsg}
          </div>
        )}
        {status === "success" && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle size={14} /> About page content saved!
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-[#F2B134] text-[#1B2A4A] font-bold text-sm rounded-xl hover:bg-[#D9960F] transition-colors disabled:opacity-60"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? "Saving…" : "Save About Content"}
        </button>
      </form>
    </div>
  );
}
