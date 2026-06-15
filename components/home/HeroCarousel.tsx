"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroSlide {
  id: string;
  type: "article" | "event" | "devotional";
  title: string;
  excerpt: string;
  image: string;
  tag: string;
  cta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  meta?: string;
}

const slides: HeroSlide[] = [
  {
    id: "s1",
    type: "event",
    title: "God-Life Conference 2026: The RISE Generation Is Coming Together",
    excerpt: "Join believers from around the world for days of worship, apostolic teaching, and prophetic activation. August 14–17.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&h=700&fit=crop",
    tag: "Featured Event",
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
    cta: { label: "Read Article", href: "/articles/walking-in-apostolic-authority" },
    meta: "Ministry · 5 min read",
  },
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
      className="relative overflow-hidden rounded-xl h-[420px] sm:h-[500px] lg:h-[580px] bg-[#0D1624]"
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
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D1624]/88 via-[#0D1624]/50 to-[#0D1624]/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1624]/60 via-transparent to-transparent" />
        </div>
      ))}

      {/* Slide content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center p-8 sm:p-12 lg:p-16">
        <div key={slide.id} className="max-w-xl">
          {/* Tag */}
          <p className="text-[#F2B134] text-[11px] font-bold uppercase tracking-[0.2em] mb-5">
            {slide.tag}
          </p>

          {/* Headline */}
          <h1
            className="text-3xl sm:text-[40px] lg:text-[52px] font-bold text-white leading-[1.08] text-balance"
            style={{ fontFamily: "var(--font-display, Georgia, serif)" }}
          >
            {slide.title}
          </h1>

          {/* Excerpt */}
          <p className="text-white/65 mt-4 text-sm sm:text-base leading-relaxed line-clamp-2 max-w-md">
            {slide.excerpt}
          </p>

          {/* Meta */}
          {slide.meta && (
            <p className="text-white/40 text-xs mt-2.5 tracking-wide font-medium">
              {slide.meta}
            </p>
          )}

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mt-7">
            <Link
              href={slide.cta.href}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-[#1B2A4A] bg-[#F2B134] rounded-lg hover:bg-[#D9960F] transition-colors"
            >
              {slide.cta.label}
            </Link>
            {slide.secondaryCta && (
              <Link
                href={slide.secondaryCta.href}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white/85 border border-white/25 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                {slide.secondaryCta.label}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Arrow controls */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/30 hover:bg-black/55 text-white flex items-center justify-center transition-colors"
      >
        <ChevronLeft size={18} aria-hidden />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/30 hover:bg-black/55 text-white flex items-center justify-center transition-colors"
      >
        <ChevronRight size={18} aria-hidden />
      </button>

      {/* Slide indicators */}
      <div
        className="absolute bottom-6 left-8 sm:left-12 lg:left-16 z-30 flex gap-2 items-center"
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
              "rounded-full transition-all duration-400",
              i === current ? "w-6 h-1.5 bg-[#F2B134]" : "w-1.5 h-1.5 bg-white/35 hover:bg-white/60"
            )}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-6 right-6 z-30 text-white/40 text-[11px] font-medium tracking-widest select-none">
        {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div>
    </section>
  );
}
