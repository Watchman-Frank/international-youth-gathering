import Link from "next/link";
import { Calendar, Globe, Radio } from "lucide-react";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { events, prayerPartyDates } from "@/lib/data/events";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prayer & Prophetic Party",
  description: "IYG's recurring intercessory gathering on US federal holidays — join online for prayer, prophetic declarations, and Spirit-led worship.",
};

export default function PrayerPartyPage() {
  const prayerEvents = events.filter((e) => e.type === "prayer-party");
  const upcoming = prayerEvents.filter((e) => e.isUpcoming);
  const past = prayerEvents.filter((e) => !e.isUpcoming);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-14">
      {/* Hero */}
      <section>
        <div className="bg-gradient-to-br from-[#1B2A4A] to-[#2D4070] rounded-3xl p-10 sm:p-14 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#F2B134]/20 mb-5">
            <Radio size={28} className="text-[#F2B134]" aria-hidden />
          </div>
          <Badge variant="gold" size="md">Recurring Event</Badge>
          <h1
            className="text-3xl sm:text-4xl font-bold text-white mt-4 text-balance"
            style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}
          >
            Prayer & Prophetic Party
          </h1>
          <p className="text-white/70 mt-4 max-w-xl mx-auto text-base leading-relaxed">
            On every US federal holiday, the IYG family gathers to intercede for the nations. While the world rests, we seek. Join us online for hours of Spirit-led prayer, prophetic declarations, and worship.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-white/60">
            <span className="flex items-center gap-2"><Calendar size={14} className="text-[#F2B134]" aria-hidden />Every US Federal Holiday</span>
            <span className="flex items-center gap-2"><Globe size={14} className="text-[#F2B134]" aria-hidden />Online · Zoom + YouTube Live</span>
          </div>
        </div>
      </section>

      {/* Upcoming dates */}
      <section aria-labelledby="upcoming-prayer-heading">
        <h2
          id="upcoming-prayer-heading"
          className="text-2xl font-bold text-[#1B2A4A] mb-6"
          style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}
        >
          Upcoming Dates
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcoming.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className="text-center bg-[#FAF8F3] rounded-xl px-4 py-3 flex-shrink-0">
                  <div className="text-2xl font-bold text-[#1B2A4A]">{new Date(event.date).getDate()}</div>
                  <div className="text-xs text-slate-500 uppercase">{new Date(event.date).toLocaleString("en-US", { month: "short" })}</div>
                  <div className="text-xs text-slate-400">{new Date(event.date).getFullYear()}</div>
                </div>
                <div>
                  <h3 className="font-bold text-[#1B2A4A] text-base" style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}>
                    {event.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{event.shortDescription}</p>
                  {event.joinLink && (
                    <a
                      href={event.joinLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#F2B134] hover:text-[#D9960F] transition-colors"
                    >
                      <Radio size={12} aria-hidden />
                      Join Online
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Full schedule */}
        <div className="mt-6 bg-[#FAF8F3] rounded-2xl p-6">
          <h3 className="font-bold text-[#1B2A4A] text-base mb-4" style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}>
            2026–2027 Schedule
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {prayerPartyDates.map(({ date, name }) => (
              <div key={date} className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-[#F2B134] flex-shrink-0" aria-hidden />
                <span className="text-slate-700 font-medium">{name}</span>
                <span className="text-slate-400 ml-auto">{formatDate(date)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past sessions */}
      {past.length > 0 && (
        <section aria-labelledby="past-prayer-heading">
          <h2
            id="past-prayer-heading"
            className="text-2xl font-bold text-[#1B2A4A] mb-6"
            style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}
          >
            Past Session Recordings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {past.flatMap((event) =>
              (event.pastRecordings ?? []).map((rec) => (
                <div key={rec.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                  <VideoPlayer youtubeId={rec.youtubeId} thumbnailUrl={rec.thumbnailUrl} title={rec.title} />
                  <div className="p-4">
                    <h3 className="font-semibold text-[#1B2A4A] text-sm" style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}>
                      {rec.title}
                    </h3>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* Why we pray */}
      <section className="bg-[#1B2A4A] rounded-2xl p-8 sm:p-12 text-white text-center">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}>
          Why Federal Holidays?
        </h2>
        <p className="text-white/70 max-w-lg mx-auto text-base leading-relaxed">
          Federal holidays are moments when nations pause. We believe those pauses are divine opportunities — strategic windows for the church to advance in prayer when the systems of the world are at rest. As Moses said: if Your presence does not go with us, we won't move from here.
        </p>
        <blockquote className="mt-6 text-[#F2B134] font-semibold italic text-base">
          "The prayer of a righteous person is powerful and effective." — James 5:16
        </blockquote>
      </section>
    </div>
  );
}
