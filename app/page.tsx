import Link from "next/link";
import { ArrowRight, BookOpen, Mic, Calendar, Play } from "lucide-react";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { NewsletterBanner } from "@/components/home/NewsletterBanner";
import { YoutubeGallery } from "@/components/home/YoutubeGallery";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { EventCard } from "@/components/cards/EventCard";
import { PodcastEpisodeCard } from "@/components/cards/PodcastEpisodeCard";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { Reveal } from "@/components/ui/Reveal";
import { articles } from "@/lib/data/articles";
import { events, upcomingEvents } from "@/lib/data/events";
import { podcastEpisodes } from "@/lib/data/podcast";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "International Youth Gathering — Daily devotionals, apostolic teaching, live events, and a podcast for young believers worldwide.",
};

// ── Reusable section header ─────────────────────────────────────
function SectionHeader({
  eyebrow, title, subtitle, center = false, light = false,
}: {
  eyebrow: string; title: string; subtitle?: string; center?: boolean; light?: boolean;
}) {
  return (
    <div className={center ? "text-center" : ""}>
      <p className="text-[#C8831A] text-[11px] font-bold uppercase tracking-[0.25em] mb-3">{eyebrow}</p>
      <h2
        className={`text-3xl sm:text-4xl font-bold leading-tight ${light ? "text-white" : "text-[#0D6B30]"}`}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-2 text-base leading-relaxed ${light ? "text-white/60" : "text-slate-500"}`}>
          {subtitle}
        </p>
      )}
      <div className={`mt-4 h-0.5 w-14 bg-[#C8831A] ${center ? "mx-auto" : ""}`} />
    </div>
  );
}

// ── Stats band ──────────────────────────────────────────────────
const STATS = [
  { number: "50K+", label: "Young Believers Connected" },
  { number: "300+", label: "Articles & Devotionals" },
  { number: "12+",  label: "Countries Reached" },
  { number: "5+",   label: "Years of Ministry" },
];

function StatsBand() {
  return (
    <div className="bg-[#0D6B30]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {STATS.map(({ number, label }, i) => (
            <Reveal key={label} delay={i * 90}>
              <div className="text-center">
                <div
                  className="text-4xl sm:text-5xl font-bold text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {number}
                </div>
                <div className="w-8 h-px bg-[#C8831A]/60 mx-auto my-2.5" />
                <div className="text-white/55 text-xs sm:text-sm font-medium">{label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Scripture / vision callout ──────────────────────────────────
function ScriptureCallout() {
  return (
    <div className="relative bg-[#083D1C] overflow-hidden">
      {/* Soft radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(200,131,26,0.07) 0%, transparent 70%)",
        }}
        aria-hidden
      />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
        <Reveal>
          <div
            className="text-[#C8831A]/15 select-none leading-none mb-0 text-[8rem] sm:text-[10rem]"
            style={{ fontFamily: "Georgia, serif", marginBottom: "-2rem" }}
            aria-hidden
          >
            &ldquo;
          </div>
          <blockquote>
            <p
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-[1.35] text-balance"
              style={{ fontFamily: "var(--font-display)" }}
            >
              To be a system of wholistic development and transformation — keeping and maintaining the Apostolic Mandate.
            </p>
            <footer className="flex items-center justify-center gap-4 mt-10">
              <div className="h-px w-14 bg-[#C8831A]/40" />
              <cite className="text-[#C8831A] text-xs font-bold uppercase tracking-[0.25em] not-italic">
                IYG Vision Statement
              </cite>
              <div className="h-px w-14 bg-[#C8831A]/40" />
            </footer>
          </blockquote>
        </Reveal>
      </div>
    </div>
  );
}

// ── Ministry pillars ────────────────────────────────────────────
const PILLARS = [
  {
    icon: BookOpen,
    title: "Teaching & Articles",
    desc: "Apostolic messages and Kingdom articles to build your faith and sharpen your understanding of God's Word.",
    href: "/articles",
    cta: "Read Articles",
  },
  {
    icon: Mic,
    title: "The Qavah Podcast",
    desc: "Honest conversations for young believers who refuse to be conformed to this world. New episodes weekly.",
    href: "/podcast",
    cta: "Listen Now",
  },
  {
    icon: Calendar,
    title: "Live Events",
    desc: "Conferences, prayer parties, and gatherings that create divine encounters and lasting transformation.",
    href: "/conference",
    cta: "View Events",
  },
];

function MinistryPillars() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <SectionHeader
            eyebrow="What We Do"
            title="Media as a Kingdom Tool"
            subtitle="IYG connects young believers worldwide through teaching, conversation, and transformative live events."
            center
          />
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 120}>
              <Link
                href={p.href}
                className="group block bg-[#F0FAF3] rounded-2xl p-8 lg:p-10 border border-transparent hover:bg-white hover:border-[#0D6B30]/12 hover:shadow-2xl hover:shadow-green-900/8 hover:-translate-y-2 transition-all duration-400"
              >
                <div className="w-14 h-14 rounded-xl bg-[#0D6B30]/10 flex items-center justify-center mb-7 group-hover:bg-[#0D6B30] transition-colors duration-300">
                  <p.icon size={24} className="text-[#0D6B30] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3
                  className="text-xl font-bold text-[#0D6B30] mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {p.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
                <div className="mt-7 flex items-center gap-2 text-sm font-bold text-[#C8831A] group-hover:gap-4 transition-all duration-300">
                  {p.cta} <ArrowRight size={14} aria-hidden />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Core values strip ───────────────────────────────────────────
const VALUES = [
  { value: "Prayer",                verse: "1 Tim 2:1" },
  { value: "Dedication",            verse: "Luke 9:62" },
  { value: "Discipline",            verse: "2 Tim 1:7" },
  { value: "Spiritual Intelligence",verse: "1 Chr 12:32" },
];

function CoreValues() {
  return (
    <div className="bg-[#F0FAF3] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.25em] text-center mb-12">
            Our Core Values
          </p>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 text-center">
          {VALUES.map(({ value, verse }, i) => (
            <Reveal key={value} delay={i * 80}>
              <div
                className="text-xl sm:text-2xl font-bold text-[#0D6B30]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {value}
              </div>
              <div className="w-8 h-px bg-[#C8831A] mx-auto my-3" />
              <div className="text-xs text-slate-400 font-medium tracking-wide">{verse}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────
export default function HomePage() {
  const featuredArticles = articles.slice(0, 6);
  const latestEpisode    = podcastEpisodes[0];
  const featuredEvent    = events.find((e) => e.isFeatured);
  const pastOnDemand     = events.filter((e) => !e.isUpcoming && e.pastRecordings?.length);

  return (
    <div className="overflow-x-hidden">

      {/* ── 1. Hero ─────────────────────────────── */}
      <HeroCarousel />

      {/* ── 2. Stats band ───────────────────────── */}
      <StatsBand />

      {/* ── 3. Latest Articles ──────────────────── */}
      <section className="bg-white py-20 sm:py-28" aria-labelledby="articles-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
              <SectionHeader
                eyebrow="Latest Articles"
                title="Words That Build Your Faith"
                subtitle="Apostolic teaching, Kingdom culture, and devotional writing"
              />
              <Link
                href="/articles"
                className="flex-shrink-0 flex items-center gap-1.5 text-sm font-semibold text-[#0D6B30] hover:text-[#C8831A] transition-colors pb-4"
              >
                View all <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <Reveal className="lg:col-span-1" delay={0}>
              <ArticleCard article={featuredArticles[0]} variant="featured" className="h-full min-h-[320px]" />
            </Reveal>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {featuredArticles.slice(1, 5).map((a, i) => (
                <Reveal key={a.id} delay={60 + i * 60}>
                  <ArticleCard article={a} />
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {featuredArticles.slice(5, 6).map((a) => (
              <Reveal key={a.id} delay={240}>
                <ArticleCard article={a} variant="horizontal" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Scripture callout ────────────────── */}
      <ScriptureCallout />

      {/* ── 5. YouTube Gallery ──────────────────── */}
      <section className="bg-[#F0FAF3] py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <YoutubeGallery />
          </Reveal>
        </div>
      </section>

      {/* ── 6. Ministry Pillars ─────────────────── */}
      <MinistryPillars />

      {/* ── 7. Upcoming Events ──────────────────── */}
      <section className="bg-[#F0FAF3] py-20 sm:py-28" aria-labelledby="events-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
              <SectionHeader
                eyebrow="Events & Gatherings"
                title="Upcoming Events"
                subtitle="Join us in person or online for life-changing encounters"
              />
              <Link
                href="/conference"
                className="flex-shrink-0 flex items-center gap-1.5 text-sm font-semibold text-[#0D6B30] hover:text-[#C8831A] transition-colors pb-4"
              >
                All events <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.map((event, i) => (
              <Reveal key={event.id} delay={i * 80}>
                <EventCard event={event} variant="strip" />
              </Reveal>
            ))}
            {upcomingEvents.length === 0 && (
              <Reveal className="col-span-full">
                <div className="text-center py-14 bg-white rounded-2xl border border-slate-100">
                  <Calendar size={28} className="text-slate-300 mx-auto mb-3" aria-hidden />
                  <p className="text-sm text-slate-400">No upcoming events right now. Check back soon!</p>
                </div>
              </Reveal>
            )}
          </div>

          {featuredEvent && (
            <Reveal delay={200} className="mt-5">
              <EventCard event={featuredEvent} variant="featured" />
            </Reveal>
          )}
        </div>
      </section>

      {/* ── 8. Podcast ──────────────────────────── */}
      <section className="bg-white py-20 sm:py-28" aria-labelledby="podcast-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
              <SectionHeader
                eyebrow="The Qavah Podcast"
                title="Honest Conversations for Kingdom Builders"
                subtitle="Refusing to be conformed — new episodes every week"
              />
              <Link
                href="/podcast"
                className="flex-shrink-0 flex items-center gap-1.5 text-sm font-semibold text-[#0D6B30] hover:text-[#C8831A] transition-colors pb-4"
              >
                All episodes <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Reveal className="lg:col-span-2" delay={60}>
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <VideoPlayer
                  youtubeId={latestEpisode.youtubeId}
                  thumbnailUrl={latestEpisode.thumbnailUrl}
                  title={latestEpisode.title}
                />
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      S{latestEpisode.season} · Ep. {latestEpisode.episode}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" aria-hidden />
                    <span className="text-[11px] font-bold text-[#C8831A] uppercase tracking-widest">New</span>
                  </div>
                  <h3
                    className="text-xl sm:text-2xl font-bold text-[#0D6B30] leading-snug"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {latestEpisode.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed line-clamp-2">
                    {latestEpisode.description}
                  </p>
                  <Link
                    href={`/podcast/${latestEpisode.id}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white bg-[#0D6B30] px-6 py-3 rounded-xl hover:bg-[#0A5423] transition-colors active:scale-95"
                  >
                    <Play size={13} fill="currentColor" aria-hidden />
                    Listen Now
                  </Link>
                </div>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">More Episodes</p>
              <div className="space-y-1">
                {podcastEpisodes.slice(1, 5).map((ep) => (
                  <PodcastEpisodeCard key={ep.id} episode={ep} variant="compact" />
                ))}
              </div>
              <Link
                href="/podcast"
                className="mt-4 flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-[#0D6B30] transition-colors py-2"
              >
                All episodes <ArrowRight size={13} aria-hidden />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 9. Past Events / On Demand ──────────── */}
      {pastOnDemand.length > 0 && (
        <section className="bg-[#F0FAF3] py-20 sm:py-28" aria-labelledby="ondemand-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
                <SectionHeader
                  eyebrow="On Demand"
                  title="Past Events · Watch Anytime"
                  subtitle="Full replays from previous conferences and gatherings"
                />
                <Link
                  href="/conference"
                  className="flex-shrink-0 flex items-center gap-1.5 text-sm font-semibold text-[#0D6B30] hover:text-[#C8831A] transition-colors pb-4"
                >
                  View all <ArrowRight size={14} aria-hidden />
                </Link>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {pastOnDemand.map((event, i) => (
                <Reveal key={event.id} delay={i * 80}>
                  <Link
                    href="/conference"
                    className="block bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-[#0D6B30]/15 hover:shadow-xl hover:shadow-green-900/8 hover:-translate-y-1.5 transition-all duration-300 group"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={event.pastRecordings![0].thumbnailUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-[#0D6B30]/40 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-[#C8831A] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                          <Play size={18} className="text-white ml-0.5" fill="currentColor" aria-hidden />
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3
                        className="font-bold text-[#0D6B30] text-sm leading-snug"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {event.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
                        <Play size={10} aria-hidden />
                        {event.pastRecordings!.length} session{event.pastRecordings!.length !== 1 ? "s" : ""} available
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 10. Core Values ─────────────────────── */}
      <CoreValues />

      {/* ── 11. Newsletter ──────────────────────── */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <NewsletterBanner />
          </Reveal>
        </div>
      </div>

    </div>
  );
}
