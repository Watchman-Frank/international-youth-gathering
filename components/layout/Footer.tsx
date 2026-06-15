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
    <footer className="bg-[#1B2A4A] text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-5">
              <img
                src="/logo.png"
                alt="International Youth Gathering"
                className="h-16 w-16 rounded-full object-cover"
              />
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-sm">
              <span className="font-semibold text-white/80">Vision:</span> To be a system of wholistic development and transformation — keeping and maintaining the Apostolic Mandate.
            </p>
            <p className="text-sm text-white/60 leading-relaxed max-w-sm mt-3">
              <span className="font-semibold text-white/80">Mission:</span> To use "The Mountain of Influence" (Media) as a kingdom tool to connect young people around the world.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="https://facebook.com/international_youthgathering"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="IYG on Facebook"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-[#F2B134]/20 border border-white/10 hover:border-[#F2B134]/40 text-white/70 hover:text-[#F2B134] flex items-center justify-center transition-all duration-300"
              >
                <FacebookIcon size={18} />
              </a>
              <a
                href="https://instagram.com/international_youthgathering"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="IYG on Instagram"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-[#F2B134]/20 border border-white/10 hover:border-[#F2B134]/40 text-white/70 hover:text-[#F2B134] flex items-center justify-center transition-all duration-300"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href="https://www.internationalyouthgathering.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="IYG Website"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-[#F2B134]/20 border border-white/10 hover:border-[#F2B134]/40 text-white/70 hover:text-[#F2B134] flex items-center justify-center transition-all duration-300"
              >
                <Globe size={18} aria-hidden />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Content</h3>
            <ul className="space-y-2.5" role="list">
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/70 hover:text-white hover:text-[#F2B134] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More + Contact */}
          <div>
            <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Ministry</h3>
            <ul className="space-y-2.5 mb-6" role="list">
              {moreLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/70 hover:text-[#F2B134] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Contact</h3>
            <div className="space-y-2.5">
              <a href="tel:+16074442359" className="flex items-center gap-2 text-sm text-white/70 hover:text-[#F2B134] transition-colors">
                <Phone size={14} aria-hidden />
                +1 607 444 2359
              </a>
              <a href="mailto:info@internationalyouthgathering.com" className="flex items-center gap-2 text-sm text-white/70 hover:text-[#F2B134] transition-colors">
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
                className="flex-1 sm:w-56 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134] focus:border-transparent"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#F2B134] text-[#1B2A4A] font-semibold text-sm rounded-lg hover:bg-[#D9960F] transition-colors flex-shrink-0"
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
            Made with <Heart size={11} className="text-[#F2B134]" fill="currentColor" aria-hidden /> for the Kingdom
          </p>
        </div>
      </div>
    </footer>
  );
}
