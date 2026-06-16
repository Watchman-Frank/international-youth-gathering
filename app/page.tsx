import Link from "next/link";
import { ArrowRight, Play, Calendar } from "lucide-react";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { NewsletterBanner } from "@/components/home/NewsletterBanner";
import { YoutubeGallery } from "@/components/home/YoutubeGallery";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { EventCard } from "@/components/cards/EventCard";
import { PodcastEpisodeCard } from "@/components/cards/PodcastEpisodeCard";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { articles } from "@/lib/data/articles";
import { events, upcomingEvents } from "@/lib/data/events";
import { podcastEpisodes } from "@/lib/data/podcast";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "International Youth Gathering — Daily devotionals, apostolic teaching, live events, and a podcast for young believers worldwide.",
};

export default function HomePage() {
  const featuredArticles = articles.slice(0, 6);
  const latestEpisode = podcastEpisodes[0];
  const featuredEvent = events.find((e) => e.isFeatured);
  const pastOnDemand = events.filter((e) => !e.isUpcoming && e.pastRecordings?.length);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-16">

      {/* ── Hero ───────────────────────────────────── */}
      <HeroCarousel />

      {/* ── Latest Articles ──────────────────────────── */}
      <section aria-labelledby="articles-heading">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <h2
              id="articles-heading"
              className="text-2xl sm:text-3xl font-bold text-[#0D6B30]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Latest Articles
            </h2>
            <p className="text-sm text-slate-500 mt-1.5">Faith, ministry, and Kingdom culture</p>
            <div className="mt-3 w-10 h-0.5 bg-[#C8831A]" />
          </div>
          <Link
            href="/articles"
            className="flex-shrink-0 flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-[#0D6B30] transition-colors pb-5"
          >
            View all <ArrowRight size={14} aria-hidden />
          </Link>
        </div>

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

        <div className="mt-5 space-y-3">
          {featuredArticles.slice(5, 6).map((a) => (
            <ArticleCard key={a.id} article={a} variant="horizontal" />
          ))}
        </div>
      </section>

      {/* ── YouTube Video Gallery ─────────────────────── */}
      <YoutubeGallery />

      {/* ── Upcoming Events ──────────────────────────── */}
      <section aria-labelledby="events-heading">
        <div className="flex items-center gap-2.5 mb-6">
          <Calendar size={18} className="text-[#0D6B30]" aria-hidden />
          <h2
            id="events-heading"
            className="text-xl font-bold text-[#0D6B30]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Upcoming Events
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} variant="strip" />
          ))}
          {upcomingEvents.length === 0 && (
            <div className="col-span-full text-center py-10 bg-white rounded-xl border border-slate-100">
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

      {/* ── Latest Podcast Episode ────────────────────── */}
      <section aria-labelledby="podcast-heading">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <h2
              id="podcast-heading"
              className="text-2xl sm:text-3xl font-bold text-[#0D6B30]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              The Qavah Podcast
            </h2>
            <p className="text-sm text-slate-500 mt-1.5">Honest conversations for young believers who refuse to be conformed</p>
            <div className="mt-3 w-10 h-0.5 bg-[#C8831A]" />
          </div>
          <Link
            href="/podcast"
            className="flex-shrink-0 flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-[#0D6B30] transition-colors pb-5"
          >
            All episodes <ArrowRight size={14} aria-hidden />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm">
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
                <span className="text-[11px] font-bold text-[#C8831A] uppercase tracking-widest">New</span>
              </div>
              <h3
                className="text-xl font-bold text-[#0D6B30] leading-snug"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {latestEpisode.title}
              </h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed line-clamp-2">{latestEpisode.description}</p>
              <Link
                href={`/podcast/${latestEpisode.id}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white bg-[#0D6B30] px-5 py-2.5 rounded-lg hover:bg-[#0A5423] transition-colors"
              >
                <Play size={14} fill="currentColor" aria-hidden />
                Listen Now
              </Link>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">More Episodes</p>
            <div className="space-y-1">
              {podcastEpisodes.slice(1, 5).map((ep) => (
                <PodcastEpisodeCard key={ep.id} episode={ep} variant="compact" />
              ))}
            </div>
            <Link
              href="/podcast"
              className="mt-3 flex items-center justify-center gap-1 text-sm font-semibold text-slate-500 hover:text-[#0D6B30] transition-colors py-2"
            >
              All episodes <ArrowRight size={13} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Past Events / On Demand ───────────────────── */}
      {pastOnDemand.length > 0 && (
        <section aria-labelledby="ondemand-heading">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <h2
                id="ondemand-heading"
                className="text-2xl sm:text-3xl font-bold text-[#0D6B30]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Past Events · On Demand
              </h2>
              <p className="text-sm text-slate-500 mt-1.5">Watch full replays from previous conferences and gatherings</p>
              <div className="mt-3 w-10 h-0.5 bg-[#C8831A]" />
            </div>
            <Link
              href="/conference"
              className="flex-shrink-0 flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-[#0D6B30] transition-colors pb-5"
            >
              View all <ArrowRight size={14} aria-hidden />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pastOnDemand.map((event) => (
              <Link
                key={event.id}
                href="/conference"
                className="block bg-white rounded-xl overflow-hidden border border-slate-100 hover:border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={event.pastRecordings![0].thumbnailUrl}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-400"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[#0D6B30]/35 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-[#C8831A] flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
                      <Play size={16} className="text-[#0D6B30] ml-0.5" fill="currentColor" aria-hidden />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#0D6B30] text-sm leading-snug" style={{ fontFamily: "var(--font-display)" }}>
                    {event.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <Play size={10} aria-hidden />
                    {event.pastRecordings!.length} session{event.pastRecordings!.length !== 1 ? "s" : ""} available
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Core Values ──────────────────────────────── */}
      <div className="bg-[#F0FAF3] border border-slate-100 rounded-xl px-8 sm:px-14 py-14">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center mb-12">
          Our Core Values
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 text-center">
          {[
            { value: "Prayer", verse: "1 Tim 2:1" },
            { value: "Dedication", verse: "Luke 9:62" },
            { value: "Discipline", verse: "2 Tim 1:7" },
            { value: "Spiritual Intelligence", verse: "1 Chr 12:32" },
          ].map(({ value, verse }) => (
            <div key={value}>
              <div
                className="text-xl sm:text-2xl font-bold text-[#0D6B30] leading-snug"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {value}
              </div>
              <div className="w-6 h-px bg-[#C8831A] mx-auto my-3" />
              <div className="text-xs text-slate-400 font-medium tracking-wide">{verse}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Newsletter ───────────────────────────────── */}
      <NewsletterBanner />
    </div>
  );
}
