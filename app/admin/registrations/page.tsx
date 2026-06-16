"use client";

import { useState, useEffect } from "react";
import { Download, Users, RefreshCw } from "lucide-react";
import { events } from "@/lib/data/events";
import type { Registration } from "@/app/api/registrations/route";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const allEvents = events.map((e) => ({ id: e.id, title: e.title }));

export default function AdminRegistrationsPage() {
  const [eventId, setEventId] = useState(allEvents[0]?.id ?? "");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);

  async function load(id: string) {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/registrations?eventId=${id}`);
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.registrations ?? []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(eventId); }, [eventId]);

  function downloadCSV() {
    if (!eventId) return;
    window.location.href = `/api/admin/registrations?eventId=${eventId}&format=csv`;
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#0D6B30]" style={{ fontFamily: "var(--font-display)" }}>Event Registrations</h1>
          <p className="text-sm text-slate-500 mt-1">View and download attendee lists for each event.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => load(eventId)} className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <RefreshCw size={14} /><span>Refresh</span>
          </button>
          <button onClick={downloadCSV} disabled={registrations.length === 0} className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-[#0D6B30] bg-[#C8831A] rounded-lg hover:bg-[#A56914] transition-colors disabled:opacity-40">
            <Download size={14} /><span>Download CSV</span>
          </button>
        </div>
      </div>

      {/* Event selector */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Select Event</label>
        <select value={eventId} onChange={(e) => setEventId(e.target.value)} className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C8831A] w-full max-w-sm">
          {allEvents.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
      </div>

      {/* Count */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0D6B30]/5 rounded-full">
          <Users size={14} className="text-[#0D6B30]" />
          <span className="text-sm font-bold text-[#0D6B30]">{registrations.length} registrant{registrations.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading…</div>
      ) : registrations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
          <Users size={32} className="text-slate-200 mx-auto mb-2" />
          <p className="text-sm text-slate-400">No registrations yet for this event.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {["Name", "Email", "Country", "Phone", "Registered"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {registrations.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-[#0D6B30] whitespace-nowrap">{r.firstName} {r.lastName}</td>
                    <td className="px-4 py-3 text-slate-600">{r.email}</td>
                    <td className="px-4 py-3 text-slate-600">{r.country}</td>
                    <td className="px-4 py-3 text-slate-400">{r.phone ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{formatDate(r.registeredAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
