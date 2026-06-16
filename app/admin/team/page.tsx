"use client";

import { useEffect, useState } from "react";
import { Shield, Plus, Trash2, Copy, CheckCircle, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import type { AdminMember } from "@/lib/roles";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminTeamPage() {
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ email: "", name: "" });
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [newMember, setNewMember] = useState<AdminMember | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const [showCodes, setShowCodes] = useState<Record<string, boolean>>({});
  const [removingId, setRemovingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/team");
      const { members: m } = await res.json();
      setMembers(m ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    setAddError("");
    setNewMember(null);
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setAddError(data.error ?? "Failed to add admin");
      } else {
        setNewMember(data.member);
        setForm({ email: "", name: "" });
        await load();
      }
    } catch {
      setAddError("Network error");
    } finally {
      setAdding(false);
    }
  }

  async function handleRemove(id: string) {
    if (!confirm("Remove this admin? Their access code will be revoked immediately.")) return;
    setRemovingId(id);
    try {
      await fetch(`/api/admin/team?id=${id}`, { method: "DELETE" });
      await load();
    } finally {
      setRemovingId(null);
    }
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  }

  const active = members.filter((m) => m.active);
  const revoked = members.filter((m) => !m.active);

  return (
    <div className="p-8 space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0D6B30]">Admin Team</h1>
        <p className="text-sm text-slate-500 mt-1">
          Appoint admins by email. They receive a unique access code to sign in at <strong>/admin/login</strong>. Revoking an admin immediately invalidates their code.
        </p>
      </div>

      {/* New member alert */}
      {newMember && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={16} className="text-green-600" />
            <p className="font-semibold text-green-800">{newMember.name} added as admin</p>
          </div>
          <p className="text-sm text-green-700 mb-3">
            Share their login code with them. This is the only time it will be shown in full.
          </p>
          <div className="flex items-center gap-3 bg-white border border-green-200 rounded-lg px-4 py-3">
            <span className="font-mono font-bold text-lg text-[#0D6B30] tracking-widest flex-1">{newMember.code}</span>
            <button
              onClick={() => copyCode(newMember.code)}
              className="text-xs font-semibold text-slate-600 hover:text-[#0D6B30] flex items-center gap-1"
            >
              {codeCopied ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />}
              {codeCopied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="text-xs text-green-600 mt-2">Login email: <strong>{newMember.email}</strong></p>
        </div>
      )}

      {/* Add form */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-bold text-[#0D6B30] mb-4 flex items-center gap-2">
          <Plus size={16} className="text-[#C8831A]" /> Appoint New Admin
        </h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0D6B30] mb-1.5">Full Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Admin Name"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8831A]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#0D6B30] mb-1.5">Email Address *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="admin@example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8831A]"
              />
            </div>
          </div>
          {addError && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle size={14} /> {addError}
            </div>
          )}
          <button
            type="submit"
            disabled={adding}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0D6B30] text-white text-sm font-bold rounded-xl hover:bg-[#0A5423] transition-colors disabled:opacity-60"
          >
            {adding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            {adding ? "Appointing…" : "Appoint Admin"}
          </button>
        </form>
      </div>

      {/* Active admins */}
      <div>
        <h2 className="font-bold text-[#0D6B30] mb-3 flex items-center gap-2">
          <Shield size={16} className="text-[#C8831A]" /> Active Admins ({active.length})
        </h2>
        {loading ? (
          <div className="text-center py-10 text-slate-400">Loading…</div>
        ) : active.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-slate-100">
            <p className="text-slate-400 text-sm">No admins appointed yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {active.map((m) => (
              <div key={m.id} className="bg-white rounded-xl border border-slate-100 px-5 py-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-[#0D6B30] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {m.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#0D6B30] text-sm">{m.name}</p>
                  <p className="text-xs text-slate-500">{m.email}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Appointed {formatDate(m.appointedAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5">
                    <span className="font-mono text-sm font-bold tracking-widest text-[#0D6B30]">
                      {showCodes[m.id] ? m.code : "••••••••"}
                    </span>
                    <button
                      onClick={() => setShowCodes((s) => ({ ...s, [m.id]: !s[m.id] }))}
                      className="text-slate-400 hover:text-slate-600"
                      title="Toggle code visibility"
                    >
                      {showCodes[m.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    <button
                      onClick={() => copyCode(m.code)}
                      className="text-slate-400 hover:text-[#0D6B30]"
                      title="Copy code"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(m.id)}
                    disabled={removingId === m.id}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    title="Revoke access"
                  >
                    {removingId === m.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Revoked */}
      {revoked.length > 0 && (
        <div>
          <h2 className="font-semibold text-slate-500 mb-3 text-sm">Revoked Admins ({revoked.length})</h2>
          <div className="space-y-2">
            {revoked.map((m) => (
              <div key={m.id} className="bg-slate-50 rounded-xl border border-slate-100 px-5 py-3 flex items-center gap-4 opacity-60">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-500 text-sm">{m.name}</p>
                  <p className="text-xs text-slate-400">{m.email} · Access revoked</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
