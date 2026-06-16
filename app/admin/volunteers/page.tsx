"use client";

import { useEffect, useState } from "react";
import { Users, Mail, ExternalLink, Calendar, Briefcase } from "lucide-react";
import type { VolunteerApplication } from "@/app/api/volunteers/route";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<VolunteerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const roles = ["All", "Graphic Designer", "Video Editor", "Social Media Manager", "Ministry Partner"];

  useEffect(() => {
    fetch("/api/admin/volunteers")
      .then((r) => r.json())
      .then(({ volunteers: v }) => setVolunteers(v ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "All" ? volunteers : volunteers.filter((v) => v.role === filter);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0D6B30]">Volunteer Applications</h1>
        <p className="text-sm text-slate-500 mt-1">{volunteers.length} total application{volunteers.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Role filter */}
      <div className="flex flex-wrap gap-2">
        {roles.map((r) => (
          <button
            key={r}
            onClick={() => setFilter(r)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filter === r ? "bg-[#0D6B30] text-white border-[#0D6B30]" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            {r}
            {r !== "All" && (
              <span className="ml-1.5 opacity-60">
                ({volunteers.filter((v) => v.role === r).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-100">
          <Users size={32} className="text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No applications yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((v) => (
            <div key={v.id} className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-[#0D6B30]">{v.name}</h3>
                    <span className="text-[10px] font-semibold bg-[#0D6B30]/10 text-[#0D6B30] px-2 py-0.5 rounded-full">
                      {v.role}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Mail size={11} /> {v.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={11} /> {formatDate(v.submittedAt)}
                    </span>
                    {v.portfolio && (
                      <a
                        href={v.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[#C8831A] hover:text-[#A56914] font-medium"
                      >
                        <Briefcase size={11} /> Portfolio <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{v.message}</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-50 flex gap-3">
                <a
                  href={`mailto:${v.email}?subject=Your IYG Volunteer Application&body=Hi ${v.name},%0A%0AThank you for applying to volunteer with IYG as a ${v.role}.`}
                  className="text-xs font-semibold text-[#0D6B30] hover:text-[#C8831A] transition-colors flex items-center gap-1"
                >
                  <Mail size={12} /> Reply via Email
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
