"use client";

import { useState } from "react";
import { Calendar, MapPin, Globe, Video, Ticket } from "lucide-react";
import { events } from "@/lib/data/events";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PastConferenceSessions } from "@/components/conference/PastConferenceSessions";
import { RegisterModal } from "@/components/events/RegisterModal";

export default function ConferencePage() {
  const upcoming = events.find((e) => e.type === "conference" && e.isUpcoming);
  const [modalOpen, setModalOpen] = useState(false);

  const eventInfo = {
    id: upcoming?.id ?? "god-life-2026",
    title: upcoming?.title ?? "God-Life Conference 2026",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Hero */}
      <section aria-labelledby="conf-heading">
        <div className="bg-gradient-to-br from-[#1B2A4A] to-[#111D33] rounded-3xl overflow-hidden">
          {upcoming?.flyer && (
            <div className="relative h-60 sm:h-80 overflow-hidden">
              <img src={upcoming.flyer} alt="God-Life Conference 2026" className="w-full h-full object-cover opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1B2A4A]" />
            </div>
          )}
          <div className="px-8 sm:px-12 pb-12 pt-4">
            <Badge variant="gold" size="md">God-Life Conference 2026</Badge>
            <h1
              id="conf-heading"
              className="text-4xl sm:text-5xl font-bold text-white mt-4 leading-tight text-balance max-w-2xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Rise: A Generation Ascending
            </h1>
            <p className="text-white/70 mt-4 max-w-xl text-base leading-relaxed">
              {upcoming?.description}
            </p>
            {upcoming && (
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-sm text-white/60">
                <span className="flex items-center gap-2">
                  <Calendar size={15} className="text-[#F2B134]" aria-hidden />
                  August 14–17, 2026
                </span>
                {upcoming.location && (
                  <span className="flex items-center gap-2">
                    <MapPin size={15} className="text-[#F2B134]" aria-hidden />
                    {upcoming.location}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Globe size={15} className="text-[#F2B134]" aria-hidden />
                  Streaming Worldwide
                </span>
              </div>
            )}
            <div className="flex flex-wrap gap-3 mt-8" id="register">
              <Button variant="gold" size="lg" className="gap-2" onClick={() => setModalOpen(true)}>
                <Ticket size={18} aria-hidden />
                Register / Get Tickets
              </Button>
              {upcoming?.watchLiveLink && (
                <a href={upcoming.watchLiveLink} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-white/10 text-white hover:bg-white/20 gap-2">
                    <Video size={18} aria-hidden />
                    Watch Live (Free)
                  </Button>
                </a>
              )}
            </div>
            <p className="text-xs text-white/40 mt-3">
              * In-person attendance requires registration and a valid ticket. Online streaming is free.
            </p>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section aria-labelledby="expect-heading">
        <h2
          id="expect-heading"
          className="text-2xl font-bold text-[#1B2A4A] mb-8"
          style={{ fontFamily: "var(--font-display)" }}
        >
          What to Expect at God-Life 2026
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: "🛐", title: "Worship Nights", body: "Spirit-led worship sessions that carry the atmosphere of heaven into every meeting." },
            { icon: "📖", title: "Apostolic Teaching", body: "Grounding word from proven apostolic voices — teaching that transforms, not just informs." },
            { icon: "🔥", title: "Prophetic Activation", body: "Dedicated times of prophetic ministry, prayer, and impartation for every attendee." },
            { icon: "🌍", title: "Global Community", body: "Connect with young believers from around the world who share your call and your fire." },
          ].map(({ icon, title, body }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-all">
              <div className="text-3xl mb-3" aria-hidden>{icon}</div>
              <h3 className="font-bold text-[#1B2A4A] mb-2" style={{ fontFamily: "var(--font-display)" }}>{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values strip */}
      <section className="bg-[#FAF8F3] rounded-2xl p-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center" aria-label="IYG Core Values">
        {[
          { value: "Prayer", desc: "The foundation of everything we build" },
          { value: "Dedication", desc: "Committed to the call at all costs" },
          { value: "Discipline", desc: "Cultivating sustainable spiritual rhythms" },
          { value: "Spiritual Intelligence", desc: "Discerning the times with wisdom" },
        ].map(({ value, desc }) => (
          <div key={value}>
            <div className="text-lg font-bold text-[#1B2A4A]" style={{ fontFamily: "var(--font-display)" }}>{value}</div>
            <div className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</div>
          </div>
        ))}
      </section>

      {/* Past Sessions */}
      <section aria-labelledby="past-heading">
        <div className="border-l-[3px] border-[#F2B134] pl-4 mb-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#F2B134] mb-1">On Demand</p>
          <h2 id="past-heading" className="text-2xl font-bold text-[#1B2A4A]" style={{ fontFamily: "var(--font-display)" }}>
            Past Conference Sessions
          </h2>
          <p className="text-sm text-slate-500 mt-1">Watch full replays from previous God-Life Conferences.</p>
        </div>
        <PastConferenceSessions />
      </section>

      <RegisterModal event={eventInfo} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
