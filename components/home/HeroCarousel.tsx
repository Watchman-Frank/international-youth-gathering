"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
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
    excerpt: "Join believers from around the world for days of worship, apostolic teaching, and prophetic activation.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&h=900&fit=crop&q=85",
    tag: "Featured Event",
    cta: { label: "Register Now", href: "/conference" },
    secondaryCta: { label: "Learn More", href: "/conference" },
    meta: "Aug 14–17, 2026 · Binghamton, NY + Online",
  },
  {
    id: "s2",
    type: "devotional",
    title: "Word for the Day: The God Who Sees You",
    excerpt: "Hagar discovered in the wilderness that God sees even those the world has overlooked. Today's devotional.",
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1600&h=900&fit=crop&q=85",
    tag: "Today's Devotional",
    cta: { label: "Watch Now", href: "/word-for-the-day" },
    meta: "Genesis 16:13 · 8 min",
  },
  {
    id: "s3",
    type: "article",
    title: "Walking in Apostolic Authority: What It Means for Young Believers",
    excerpt: "We are commissioned to carry the Apostolic Mandate into every sphere of influence. Discover what that looks like today.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&h=900&fit=crop&q=85",
    tag: "Latest Article",
    cta: { label: "Read Article", href: "/articles/walking-in-apostolic-authority" },
    meta: "Ministry · 5 min read",
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const goTo = useCallback((idx: number) => {
    setCurrent(idx);
    setAnimKey((k) => k + 1);
  }, []);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [paused, next]);

  const slide = slides[current];

  return (
    <section
      className="relative overflow-hidden bg-[#083D1C]"
      style={{ height: "calc(100svh - 64px)", minHeight: "580px", maxHeight: "960px" }}
      aria-label="Featured content carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background images */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
          aria-hidden={i !== current}
        >
          <img
            src={s.image}
            alt=""
            className="w-full h-full object-cover scale-[1.03]"
            style={{ transition: "transform 8s ease" }}
            loading={i === 0 ? "eager" : "lazy"}
          />
          {/* Multi-layer gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#083D1C]/95 via-[#083D1C]/65 to-[#083D1C]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#083D1C]/80 via-transparent to-[#083D1C]/20" />
        </div>
      ))}

      {/* Decorative gold circle accent */}
      <div
        className="absolute -right-40 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#C8831A]/10 z-10 pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute -right-24 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#C8831A]/8 z-10 pointer-events-none"
        aria-hidden
      />

      {/* Slide content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32">
        <div key={animKey} className="max-w-3xl">
          {/* Tag pill */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0ms" }}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C8831A]/40 bg-[#C8831A]/15 text-[#C8831A] text-[11px] font-bold uppercase tracking-[0.2em] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8831A] inline-block animate-pulse" aria-hidden />
              {slide.tag}
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-5xl lg:text-[62px] xl:text-[72px] font-bold text-white leading-[1.06] text-balance animate-fade-in-up"
            style={{
              fontFamily: "var(--font-display, Georgia, serif)",
              animationDelay: "80ms",
            }}
          >
            {slide.title}
          </h1>

          {/* Excerpt */}
          <p
            className="text-white/65 mt-5 text-base sm:text-lg leading-relaxed line-clamp-2 max-w-xl animate-fade-in-up"
            style={{ animationDelay: "160ms" }}
          >
            {slide.excerpt}
          </p>

          {/* Meta */}
          {slide.meta && (
            <p
              className="text-white/40 text-xs mt-2 tracking-widest font-medium animate-fade-in-up"
              style={{ animationDelay: "220ms" }}
            >
              {slide.meta}
            </p>
          )}

          {/* CTAs */}
          <div
            className="flex flex-wrap gap-3 mt-8 animate-fade-in-up"
            style={{ animationDelay: "280ms" }}
          >
            <Link
              href={slide.cta.href}
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold text-white bg-[#C8831A] rounded-xl hover:bg-[#A56914] transition-all duration-300 active:scale-95 shadow-lg shadow-black/20"
            >
              {slide.cta.label}
            </Link>
            {slide.secondaryCta && (
              <Link
                href={slide.secondaryCta.href}
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white/85 border border-white/25 rounded-xl hover:bg-white/12 hover:text-white hover:border-white/40 transition-all duration-300"
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
        className="absolute left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 border border-white/15 hover:border-white/30 text-white flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
      >
        <ChevronLeft size={18} aria-hidden />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 border border-white/15 hover:border-white/30 text-white flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
      >
        <ChevronRight size={18} aria-hidden />
      </button>

      {/* Slide indicators */}
      <div
        className="absolute bottom-8 left-8 sm:left-16 lg:left-24 xl:left-32 z-30 flex gap-2 items-center"
        role="tablist"
        aria-label="Carousel navigation"
      >
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            role="tab"
            aria-selected={i === current}
            aria-label={`Slide ${i + 1}: ${s.title}`}
            className={cn(
              "rounded-full transition-all duration-500",
              i === current ? "w-8 h-1.5 bg-[#C8831A]" : "w-1.5 h-1.5 bg-white/30 hover:bg-white/55"
            )}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-8 right-7 z-30 text-white/35 text-[11px] font-medium tracking-[0.15em] select-none">
        {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 text-white/30 animate-bounce" aria-hidden>
        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
        <ChevronDown size={14} />
      </div>
    </section>
  );
}
