"use client";

import { useState, useEffect } from "react";
import { resources as staticResources } from "@/lib/data/library";
import { Plus, Trash2, ExternalLink, RefreshCw } from "lucide-react";
import type { Resource } from "@/lib/types";
import { cn } from "@/lib/utils";

type ResourceType = Resource["type"];
type ResourceTopic = Resource["topic"];

const TYPES: ResourceType[] = ["pdf", "guide", "study", "video", "audio", "ebook"];
const TOPICS: ResourceTopic[] = ["Prayer", "Leadership", "Evangelism", "Bible Study", "Worship", "Spiritual Growth", "Youth Ministry", "Prophetic"];

const emptyForm = { title: "", description: "", type: "pdf" as ResourceType, topic: "Prayer" as ResourceTopic, isFree: true, downloadUrl: "", externalUrl: "", price: "", fileSize: "", thumbnailUrl: "" };

export default function AdminLibraryPage() {
  const [additions, setAdditions] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/library");
      if (res.ok) { const d = await res.json(); setAdditions(d.resources ?? []); }
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/library", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        type: form.type,
        topic: form.topic,
        isFree: form.isFree,
        downloadUrl: form.isFree ? form.downloadUrl : undefined,
        externalUrl: !form.isFree ? form.externalUrl : undefined,
        price: !form.isFree ? form.price : undefined,
        fileSize: form.fileSize || undefined,
        thumbnailUrl: form.thumbnailUrl || "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
        downloads: 0,
        publishedAt: new Date().toISOString(),
      }),
    });
    if (res.ok) { setForm(emptyForm); setShowForm(false); await load(); }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this resource from the library?")) return;
    await fetch(`/api/admin/library?id=${id}`, { method: "DELETE" });
    await load();
  }

  const all = [...additions, ...staticResources.map((r) => ({ ...r, _static: true }))];

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#1B2A4A]" style={{ fontFamily: "var(--font-display)" }}>Library</h1>
          <p className="text-sm text-slate-500 mt-1">{all.length} resources total · {additions.length} added via admin</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <RefreshCw size={14} />
          </button>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#1B2A4A] bg-[#F2B134] rounded-lg hover:bg-[#D9960F] transition-colors">
            <Plus size={15} />Add Resource
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-100 p-6 mb-6">
          <h2 className="font-bold text-[#1B2A4A] mb-4">New Resource</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Title *</label>
                <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134]" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Description *</label>
                <textarea required rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134] resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Type</label>
                <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as ResourceType }))} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#F2B134]">
                  {TYPES.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Topic</label>
                <select value={form.topic} onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value as ResourceTopic }))} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#F2B134]">
                  {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2 flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isFree} onChange={(e) => setForm((f) => ({ ...f, isFree: e.target.checked }))} className="w-4 h-4 rounded accent-[#F2B134]" />
                  <span className="text-sm font-medium text-slate-600">Free resource</span>
                </label>
              </div>
              {form.isFree ? (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Download URL (PDF / file link)</label>
                  <input value={form.downloadUrl} onChange={(e) => setForm((f) => ({ ...f, downloadUrl: e.target.value }))} placeholder="https://… or Vercel Blob URL" className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134]" />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Buy/External URL</label>
                    <input value={form.externalUrl} onChange={(e) => setForm((f) => ({ ...f, externalUrl: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Price (e.g. $9.99)</label>
                    <input value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134]" />
                  </div>
                </>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Thumbnail URL (optional)</label>
                <input value={form.thumbnailUrl} onChange={(e) => setForm((f) => ({ ...f, thumbnailUrl: e.target.value }))} placeholder="https://…" className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">File Size (optional, e.g. 2.4 MB)</label>
                <input value={form.fileSize} onChange={(e) => setForm((f) => ({ ...f, fileSize: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134]" />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-[#1B2A4A] text-white text-sm font-bold rounded-xl hover:bg-[#2D4070] transition-colors disabled:opacity-60">
                {saving && <span className="h-3 w-3 rounded-full border border-white/30 border-t-white animate-spin" />}
                Save Resource
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-slate-200 text-slate-600 text-sm rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading…</div>
      ) : (
        <div className="space-y-3">
          {all.map((r) => {
            const isStatic = "_static" in r;
            return (
              <div key={r.id} className={cn("flex items-center gap-4 bg-white rounded-xl border p-4 transition-all", isStatic ? "border-slate-100" : "border-[#F2B134]/30")}>
                <img src={r.thumbnailUrl} alt="" className="w-14 h-10 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1B2A4A] truncate">{r.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 capitalize">{r.type} · {r.topic} · {r.isFree ? "Free" : r.price}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!isStatic && (
                    <button onClick={() => handleDelete(r.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                  {(r.downloadUrl || r.externalUrl) && r.downloadUrl !== "#download" && (
                    <a href={r.downloadUrl ?? r.externalUrl ?? "#"} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-[#1B2A4A] hover:bg-slate-100 transition-colors">
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {isStatic && <span className="text-[10px] text-slate-300 font-medium">static</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
