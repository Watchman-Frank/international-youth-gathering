"use client";

import Link from "next/link";
import { Phone, Mail, Globe, Heart } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/ui/SocialIcons";

const quickLinks = [
  { href: "/articles", label: "Articles" },
  { href: "/word-for-the-day", label: "Word for the Day" },
  { href: "/conference", label: "God-Life Conference" },
  { href: "/prayer-party", label: "Prayer & Prophetic Party" },
  { href: "/podcast", label: "The Qavah Podcast" },
  { href: "/library", label: "Library" },
];

const moreLinks = [
  { href: "/about", label: "About IYG" },
  { href: "/get-involved", label: "Get Involved" },
  { href: "/give", label: "Give / Support" },
  { href: "/articles/submit", label: "Submit an Article" },
];

export function Footer() {
  return (
    <footer className="bg-[#083D1C] text-white mt-20 border-t-4 border-[#C8831A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-5">
              <img
                src="/logo.png"
                alt="International Youth Gathering"
                className="h-16 w-16 rounded-full object-cover ring-2 ring-[#C8831A]/40"
              />
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-sm">
              <span className="font-semibold text-[#C8831A]">Vision:</span> To be a system of wholistic development and transformation — keeping and maintaining the Apostolic Mandate.
            </p>
            <p className="text-sm text-white/60 leading-relaxed max-w-sm mt-3">
              <span className="font-semibold text-[#C8831A]">Mission:</span> To use &ldquo;The Mountain of Influence&rdquo; (Media) as a kingdom tool to connect young people around the world.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="https://facebook.com/international_youthgathering"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="IYG on Facebook"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-[#C8831A]/20 border border-white/10 hover:border-[#C8831A]/40 text-white/70 hover:text-[#C8831A] flex items-center justify-center transition-all duration-300"
              >
                <FacebookIcon size={18} />
              </a>
              <a
                href="https://instagram.com/international_youthgathering"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="IYG on Instagram"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-[#C8831A]/20 border border-white/10 hover:border-[#C8831A]/40 text-white/70 hover:text-[#C8831A] flex items-center justify-center transition-all duration-300"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href="https://www.internationalyouthgathering.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="IYG Website"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-[#C8831A]/20 border border-white/10 hover:border-[#C8831A]/40 text-white/70 hover:text-[#C8831A] flex items-center justify-center transition-all duration-300"
              >
                <Globe size={18} aria-hidden />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-[#C8831A]/80 uppercase tracking-widest mb-4">Content</h3>
            <ul className="space-y-2.5" role="list">
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/70 hover:text-[#C8831A] transition-all duration-300">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More + Contact */}
          <div>
            <h3 className="text-xs font-bold text-[#C8831A]/80 uppercase tracking-widest mb-4">Ministry</h3>
            <ul className="space-y-2.5 mb-6" role="list">
              {moreLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/70 hover:text-[#C8831A] transition-all duration-300">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-xs font-bold text-[#C8831A]/80 uppercase tracking-widest mb-4">Contact</h3>
            <div className="space-y-2.5">
              <a href="tel:+16074442359" className="flex items-center gap-2 text-sm text-white/70 hover:text-[#C8831A] transition-all duration-300">
                <Phone size={14} aria-hidden />
                +1 607 444 2359
              </a>
              <a href="mailto:info@internationalyouthgathering.com" className="flex items-center gap-2 text-sm text-white/70 hover:text-[#C8831A] transition-all duration-300">
                <Mail size={14} aria-hidden />
                info@internationalyouthgathering.com
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h3 className="font-semibold text-white">Stay Connected</h3>
              <p className="text-sm text-white/60 mt-0.5">Get daily devotionals and ministry updates in your inbox.</p>
            </div>
            <form
              className="flex gap-2 w-full sm:w-auto"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Newsletter signup"
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 sm:w-56 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8831A] focus:border-transparent"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#C8831A] text-white font-semibold text-sm rounded-lg hover:bg-[#A56914] transition-all duration-300 active:scale-95 flex-shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} International Youth Gathering. All rights reserved.
          </p>
          <p className="text-xs text-white/40 flex items-center gap-1">
            Made with <Heart size={11} className="text-[#C8831A]" fill="currentColor" aria-hidden /> for the Kingdom
          </p>
        </div>
      </div>
    </footer>
  );
}
