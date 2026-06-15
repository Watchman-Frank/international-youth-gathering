"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Calendar, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface HeroSlide {
  id: string;
  type: "article" | "event" | "devotional";
  title: string;
  excerpt: string;
  image: string;
  tag: string;
  tagVariant?: "gold" | "navy" | "default";
  cta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  meta?: string;
}

const slides: HeroSlide[] = [
  {
    id: "s1",
    type: "article",
    title: "God-Life Conference 2026: The RISE Generation Is Coming Together",
    excerpt: "Join believers from around the world for days of worship, apostolic teaching, and prophetic activation. August 14–17.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&h=700&fit=crop",
    tag: "Featured Event",
    tagVariant: "gold",
    cta: { label: "Register Now", href: "/conference" },
    secondaryCta: { label: "Learn More", href: "/conference" },
    meta: "Aug 14–17, 2026 · Binghamton, NY + Online",
  },
  {
    id: "s2",
    type: "devotional",
    title: "Word for the Day: The God Who Sees You",
    excerpt: "Hagar discovered in the wilderness that God sees even those the world has overlooked. Today's devotional — under 10 minutes.",
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1400&h=700&fit=crop",
    tag: "Today's Devotional",
    tagVariant: "navy",
    cta: { label: "Watch Now", href: "/word-for-the-day" },
    meta: "Genesis 16:13 · 8 min",
  },
  {
    id: "s3",
    type: "article",
    title: "Walking in Apostolic Authority: What It Means for Young Believers",
    excerpt: "We are commissioned to carry the Apostolic Mandate into every sphere of influence. Discover what that looks like today.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400&h=700&fit=crop",
    tag: "Latest Article",
    tagVariant: "default",
    cta: { label: "Read Article", href: "/articles/walking-in-apostolic-authority" },
    meta: "Ministry · 5 min read",
  },
];

/* Star positions: [cx%, cy%, r, delayS, durS] */
const STARS = [
  [8, 15, 1.5, 0, 2.8], [91, 11, 1, 0.5, 3.2], [77, 34, 2, 1.1, 2.4],
  [16, 64, 1, 0.3, 3.5], [54, 80, 1.5, 0.8, 2.6], [87, 71, 1, 1.4, 3.0],
  [34, 22, 1, 0.6, 3.8], [64, 54, 1.5, 1.2, 2.2], [23, 86, 1, 0.9, 3.3],
  [47, 9, 2, 1.6, 2.7], [72, 90, 1, 0.2, 3.6], [5, 45, 1.5, 1.3, 2.9],
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [paused, next]);

  const slide = slides[current];

  return (
    <section
      className="relative overflow-hidden rounded-2xl h-[440px] sm:h-[520px] lg:h-[600px] gradient-navy"
      aria-label="Featured content carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background images */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
          aria-hidden={i !== current}
        >
          <img
            src={s.image}
            alt={s.title}
            className="w-full h-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
          />
          {/* Dual-layer gradient for strong text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#111D33]/95 via-[#1B2A4A]/65 to-[#1B2A4A]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111D33]/75 via-transparent to-transparent" />
        </div>
      ))}

      {/* Twinkling star particles */}
      <svg
        className="absolute inset-0 w-full h-full z-[15] pointer-events-none"
        aria-hidden
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {STARS.map(([x, y, r, delay, dur], i) => (
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

      {/* Slide content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-10 lg:p-14 pb-16 sm:pb-16">
        <div key={slide.id} className="max-w-2xl">

          {/* Glass tag pill */}
          <div className="mb-4 anim-up">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.13em] backdrop-blur-md border",
                slide.tagVariant === "gold"
                  ? "bg-[#F2B134]/20 border-[#F2B134]/50 text-[#F2B134]"
                  : "bg-white/10 border-white/20 text-white/80"
              )}
            >
              {slide.type === "event" && <Calendar size={10} aria-hidden />}
              {slide.type === "devotional" && <Video size={10} aria-hidden />}
              {slide.tag}
            </span>
          </div>

          {/* Headline — Jitter.video scale */}
          <h1
            className="text-3xl sm:text-[42px] lg:text-[54px] font-bold text-white leading-[1.07] text-balance anim-up-d1"
            style={{ fontFamily: "var(--font-display, Georgia, serif)" }}
          >
            {slide.title}
          </h1>

          {/* Excerpt */}
          <p className="text-white/70 mt-4 text-sm sm:text-base leading-relaxed line-clamp-2 anim-up-d2">
            {slide.excerpt}
          </p>

          {/* Meta */}
          {slide.meta && (
            <p className="text-[#F2B134]/90 text-[11px] font-semibold mt-2.5 tracking-wider anim-up-d2">
              {slide.meta}
            </p>
          )}

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mt-6 anim-up-d3">
            <Link href={slide.cta.href}>
              <Button variant="gold" size="md">{slide.cta.label}</Button>
            </Link>
            {slide.secondaryCta && (
              <Link href={slide.secondaryCta.href}>
                <Button variant="ghost" className="text-white hover:bg-white/15 border border-white/25" size="md">
                  {slide.secondaryCta.label}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Arrow controls */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/25 hover:bg-black/50 border border-white/15 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm hover:scale-110"
      >
        <ChevronLeft size={19} aria-hidden />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/25 hover:bg-black/50 border border-white/15 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm hover:scale-110"
      >
        <ChevronRight size={19} aria-hidden />
      </button>

      {/* Gold-glow progress indicators (left-aligned with content) */}
      <div
        className="absolute bottom-5 left-6 sm:left-10 lg:left-14 z-30 flex gap-2 items-center"
        role="tablist"
        aria-label="Carousel navigation"
      >
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setCurrent(i)}
            role="tab"
            aria-selected={i === current}
            aria-label={`Slide ${i + 1}: ${s.title}`}
            className={cn(
              "rounded-full transition-all duration-500 h-[3px]",
              i === current
                ? "w-12 bg-[#F2B134] shadow-[0_0_10px_rgba(242,177,52,0.8)]"
                : "w-4 bg-white/35 hover:bg-white/65"
            )}
          />
        ))}
      </div>
    </section>
  );
}
