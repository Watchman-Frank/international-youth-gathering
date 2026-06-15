import Link from "next/link";
import { ArrowRight, BookOpen, Mic2, Play, Calendar, ChevronRight, Flame, Globe } from "lucide-react";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { NewsletterBanner } from "@/components/home/NewsletterBanner";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { EventCard } from "@/components/cards/EventCard";
import { PodcastEpisodeCard } from "@/components/cards/PodcastEpisodeCard";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { articles } from "@/lib/data/articles";
import { events, upcomingEvents } from "@/lib/data/events";
import { devotionals } from "@/lib/data/devotionals";
import { podcastEpisodes } from "@/lib/data/podcast";
import { formatShortDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "International Youth Gathering — Daily devotionals, apostolic teaching, live events, and a podcast for young believers worldwide.",
};

function SectionHeading({
  id,
  title,
  subtitle,
  eyebrow,
  href,
  hrefLabel = "View all",
}: {
  id: string;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-6 gap-4">
      <div className="border-l-[3px] border-[#F2B134] pl-4">
        {eyebrow && (
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#F2B134] mb-1">
            {eyebrow}
          </p>
        )}
        <h2
          id={id}
          className="text-2xl sm:text-3xl font-bold text-[#1B2A4A] leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h2>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="flex-shrink-0 flex items-center gap-1 text-sm font-semibold text-[#1B2A4A] hover:text-[#F2B134] transition-colors"
        >
          {hrefLabel} <ArrowRight size={14} aria-hidden />
        </Link>
      )}
    </div>
  );
}

export default function HomePage() {
  const featuredArticles = articles.slice(0, 6);
  const todayDevotional = devotionals[0];
  const latestEpisode = podcastEpisodes[0];
  const featuredEvent = events.find((e) => e.isFeatured);
  const pastOnDemand = events.filter((e) => !e.isUpcoming && e.pastRecordings?.length);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-16">
      {/* ── Hero ─────────────────────────────────── */}
      <HeroCarousel />

      {/* ── Stats strip ──────────────────────────── */}
      <div className="gradient-navy rounded-2xl p-4 sm:p-5 -mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { value: "10k+", label: "Lives Touched", icon: Globe },
          { value: "Daily", label: "Word for the Day", icon: BookOpen },
          { value: "12+", label: "Podcast Episodes", icon: Mic2 },
          { value: "Global", label: "Reach & Community", icon: Flame },
        ].map(({ value, label, icon: Icon }) => (
          <div
            key={label}
            className="glass rounded-xl p-4 text-center hover:-translate-y-1 hover:bg-white/15 transition-all duration-300"
          >
            <Icon
              size={18}
              className="text-[#F2B134] mx-auto mb-2"
              style={{ filter: "drop-shadow(0 0 6px rgba(242,177,52,0.65))" }}
              aria-hidden
            />
            <div
              className="text-xl font-bold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {value}
            </div>
            <div className="text-xs text-white/50 mt-0.5 leading-tight">{label}</div>
          </div>
        ))}
      </div>

      {/* ── Latest Articles ───────────────────────── */}
      <section aria-labelledby="articles-heading">
        <SectionHeading
          id="articles-heading"
          title="Latest Articles"
          subtitle="Faith, ministry, and Kingdom culture"
          eyebrow="Kingdom Media"
          href="/articles"
        />

        {/* Featured + grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-1">
            <ArticleCard article={featuredArticles[0]} variant="featured" className="h-full min-h-[280px]" />
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {featuredArticles.slice(1, 5).map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </div>

        {/* Horizontal list */}
        <div className="mt-5 space-y-3">
          {featuredArticles.slice(5, 6).map((a) => (
            <ArticleCard key={a.id} article={a} variant="horizontal" />
          ))}
        </div>
      </section>

      {/* ── Word for the Day + Upcoming Events ────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        {/* Word for the Day */}
        <section className="lg:col-span-3" aria-labelledby="wftd-heading">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                <BookOpen size={17} className="text-amber-600" aria-hidden />
              </div>
              <div>
                <h2
                  id="wftd-heading"
                  className="text-lg font-bold text-[#1B2A4A] leading-none"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Word for the Day
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">{formatShortDate(todayDevotional.date)}</p>
              </div>
            </div>
            <Link
              href="/word-for-the-day"
              className="text-sm font-semibold text-slate-500 hover:text-[#1B2A4A] flex items-center gap-1 transition-colors"
            >
              Archive <ChevronRight size={13} aria-hidden />
            </Link>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
            <VideoPlayer
              youtubeId={todayDevotional.youtubeId}
              thumbnailUrl={todayDevotional.thumbnailUrl}
              title={todayDevotional.title}
            />
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                  <BookOpen size={10} aria-hidden />
                  {todayDevotional.scripture}
                </span>
              </div>
              <h3
                className="text-xl font-bold text-[#1B2A4A] leading-snug"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {todayDevotional.title}
              </h3>
              {todayDevotional.scriptureText && (
                <blockquote className="mt-3 text-sm text-slate-600 italic border-l-2 border-[#F2B134] pl-3 leading-relaxed">
                  {todayDevotional.scriptureText}
                </blockquote>
              )}
              <p className="text-sm text-slate-500 mt-3 leading-relaxed line-clamp-3">{todayDevotional.summary}</p>
              <Link
                href="/word-for-the-day"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#1B2A4A] hover:text-[#F2B134] transition-colors"
              >
                Full devotional <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="lg:col-span-2" aria-labelledby="events-heading">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-xl bg-[#1B2A4A]/5 border border-[#1B2A4A]/10 flex items-center justify-center">
              <Calendar size={17} className="text-[#1B2A4A]" aria-hidden />
            </div>
            <h2
              id="events-heading"
              className="text-lg font-bold text-[#1B2A4A]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Upcoming Events
            </h2>
          </div>

          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} variant="strip" />
            ))}
            {upcomingEvents.length === 0 && (
              <div className="text-center py-10 bg-white rounded-xl border border-slate-100">
                <Calendar size={24} className="text-slate-300 mx-auto mb-2" aria-hidden />
                <p className="text-sm text-slate-400">No upcoming events. Check back soon!</p>
              </div>
            )}
          </div>

          {featuredEvent && (
            <div className="mt-4">
              <EventCard event={featuredEvent} variant="featured" />
            </div>
          )}
        </section>
      </div>

      {/* ── Latest Podcast Episode ─────────────────── */}
      <section aria-labelledby="podcast-heading">
        <SectionHeading
          id="podcast-heading"
          title="The Qavah Podcast"
          subtitle="Honest conversations for young believers who refuse to be conformed"
          eyebrow="Audio & Video"
          href="/podcast"
          hrefLabel="All episodes"
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured episode */}
          <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
            <VideoPlayer
              youtubeId={latestEpisode.youtubeId}
              thumbnailUrl={latestEpisode.thumbnailUrl}
              title={latestEpisode.title}
            />
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  S{latestEpisode.season} · Ep. {latestEpisode.episode}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300" aria-hidden />
                <span className="text-[11px] font-bold text-[#F2B134] uppercase tracking-widest">New</span>
              </div>
              <h3
                className="text-xl font-bold text-[#1B2A4A] leading-snug"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {latestEpisode.title}
              </h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed line-clamp-2">{latestEpisode.description}</p>
              <Link
                href={`/podcast/${latestEpisode.id}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white bg-[#1B2A4A] px-5 py-2.5 rounded-xl hover:bg-[#2D4070] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <Play size={14} fill="currentColor" aria-hidden />
                Listen Now
              </Link>
            </div>
          </div>

          {/* Episode list sidebar */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">More Episodes</p>
            <div className="space-y-1">
              {podcastEpisodes.slice(1, 5).map((ep) => (
                <PodcastEpisodeCard key={ep.id} episode={ep} variant="compact" />
              ))}
            </div>
            <Link
              href="/podcast"
              className="mt-3 flex items-center justify-center gap-1 text-sm font-semibold text-[#1B2A4A] hover:text-[#F2B134] transition-colors py-2"
            >
              All episodes <ArrowRight size={13} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Past Events / On Demand ────────────────── */}
      {pastOnDemand.length > 0 && (
        <section aria-labelledby="ondemand-heading">
          <SectionHeading
            id="ondemand-heading"
            title="Past Events · On Demand"
            subtitle="Watch full replays from previous conferences and gatherings"
            eyebrow="Recordings"
            href="/conference"
            hrefLabel="View all"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pastOnDemand.map((event) => (
              <Link
                key={event.id}
                href="/conference"
                className="card-beam block bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-[#F2B134]/25 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={event.pastRecordings![0].thumbnailUrl}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[#1B2A4A]/40 flex items-center justify-center">
                    <div className="w-13 h-13 w-12 h-12 rounded-full bg-[#F2B134] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Play size={18} className="text-[#1B2A4A] ml-0.5" fill="currentColor" aria-hidden />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#1B2A4A] text-sm leading-snug" style={{ fontFamily: "var(--font-display)" }}>
                    {event.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <Play size={11} aria-hidden />
                    {event.pastRecordings!.length} session{event.pastRecordings!.length !== 1 ? "s" : ""} available
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Core Values strip ─────────────────────── */}
      <div className="gradient-navy rounded-3xl p-8 sm:p-12 relative overflow-hidden">
        {/* Twinkling star particles */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
          aria-hidden
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {[
            [10, 15, 1, 0, 3], [84, 20, 1.5, 0.7, 2.5], [50, 78, 1, 1.2, 3.5],
            [25, 58, 1.5, 0.4, 2.8], [74, 44, 1, 1.8, 3.2], [91, 74, 2, 0.2, 2.3],
            [40, 28, 1, 1.0, 3.8], [16, 84, 1.5, 0.6, 2.6], [62, 10, 1, 0.3, 3.0],
          ].map(([x, y, r, delay, dur], i) => (
            <circle
              key={i}
              cx={`${x}%`}
              cy={`${y}%`}
              r={r}
              fill="#F2B134"
              style={{ animation: `twinkle ${dur}s ${delay}s ease-in-out infinite` }}
            />
          ))}
        </svg>

        <div className="relative z-10">
          <p className="text-[11px] font-bold text-[#F2B134] uppercase tracking-[0.18em] text-center mb-10">
            Our Core Values
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { value: "Prayer", verse: "1 Tim 2:1" },
              { value: "Dedication", verse: "Luke 9:62" },
              { value: "Discipline", verse: "2 Tim 1:7" },
              { value: "Spiritual Intelligence", verse: "1 Chr 12:32" },
            ].map(({ value, verse }) => (
              <div key={value} className="group">
                <div
                  className="text-base sm:text-xl font-bold text-white leading-snug group-hover:text-[#F2B134] transition-colors duration-300"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {value}
                </div>
                <div className="text-xs text-white/40 mt-1.5 font-medium tracking-wide">{verse}</div>
                <div className="mt-3 mx-auto w-5 h-px bg-[#F2B134]/25 group-hover:bg-[#F2B134]/70 group-hover:w-10 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Newsletter ────────────────────────────── */}
      <NewsletterBanner />
    </div>
  );
}
