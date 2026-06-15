import Link from "next/link";
import {
  User,
  BookOpen,
  Calendar,
  Download,
  Play,
  Settings,
  LogOut,
  Bookmark,
  Award,
} from "lucide-react";
import { articles } from "@/lib/data/articles";
import { events } from "@/lib/data/events";
import { formatShortDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your IYG account, saved content, and registered events.",
};

const savedArticles = articles.slice(0, 3);
const registeredEvents = events.filter((e) => e.isUpcoming).slice(0, 2);

const continueWatching = [
  {
    id: "d3",
    title: "Run With Endurance",
    thumbnailUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=200&h=120&fit=crop",
    progress: 65,
    type: "devotional",
    href: "/word-for-the-day",
  },
  {
    id: "ep11",
    title: "The Qavah Podcast Ep. 11 — Social Media, Ministry...",
    thumbnailUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200&h=120&fit=crop",
    progress: 32,
    type: "podcast",
    href: "/podcast/ep11",
  },
];

const downloadHistory = [
  { title: "The Intercessor's Guide: 30 Days of Strategic Prayer", date: "2026-06-01", size: "2.4 MB" },
  { title: "Evangelism in the Digital Age", date: "2026-05-20", size: "1.2 MB" },
];

export default function ProfilePage() {
  const isLoggedIn = false; // Placeholder — would be from auth context

  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-[#FAF8F3] border-2 border-[#1B2A4A]/10 flex items-center justify-center mb-6">
          <User size={32} className="text-[#1B2A4A]/40" aria-hidden />
        </div>
        <h1 className="text-2xl font-bold text-[#1B2A4A]" style={{ fontFamily: "var(--font-display)" }}>
          Sign In to View Your Profile
        </h1>
        <p className="text-slate-500 mt-2 text-sm max-w-xs leading-relaxed">
          Create a free IYG account to save articles, register for events, download resources, and track your watch history.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link
            href="/sign-in"
            className="px-6 py-3 bg-[#1B2A4A] text-white font-semibold text-sm rounded-xl hover:bg-[#2D4070] transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/sign-in"
            className="px-6 py-3 border border-slate-200 text-[#1B2A4A] font-semibold text-sm rounded-xl hover:bg-slate-50 transition-colors"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg w-full">
          {[
            { icon: Bookmark, title: "Save Content", desc: "Bookmark articles and devotionals" },
            { icon: Calendar, title: "Register for Events", desc: "Get tickets to God-Life Conference" },
            { icon: Download, title: "Download Resources", desc: "Access the full IYG library" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl border border-slate-100 p-4 text-left">
              <Icon size={20} className="text-[#F2B134] mb-2" aria-hidden />
              <h3 className="font-semibold text-[#1B2A4A] text-sm">{title}</h3>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Logged-in state (shown when auth is integrated)
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Profile header */}
      <div className="flex items-start gap-5">
        <div className="w-16 h-16 rounded-full bg-[#1B2A4A] flex items-center justify-center flex-shrink-0 text-white font-bold text-xl" style={{ fontFamily: "var(--font-display)" }}>
          JD
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#1B2A4A]" style={{ fontFamily: "var(--font-display)" }}>John Doe</h1>
          <p className="text-slate-500 text-sm">john@example.com</p>
          <div className="flex items-center gap-2 mt-2">
            <Award size={14} className="text-[#F2B134]" aria-hidden />
            <span className="text-xs text-slate-500">IYG Member since January 2025</span>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#1B2A4A] transition-colors">
          <Settings size={16} aria-hidden /> Settings
        </button>
      </div>

      {/* Continue watching */}
      <section aria-labelledby="continue-heading">
        <h2 className="text-lg font-bold text-[#1B2A4A] mb-4" style={{ fontFamily: "var(--font-display)" }} id="continue-heading">
          Continue Watching
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {continueWatching.map((item) => (
            <Link key={item.id} href={item.href} className="flex gap-3 bg-white rounded-xl border border-slate-100 p-3 hover:shadow-md transition-all group">
              <div className="relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden">
                <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Play size={16} className="text-white" fill="white" aria-hidden />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-[#1B2A4A] line-clamp-2 leading-snug group-hover:text-[#2D4070]">{item.title}</h3>
                <div className="mt-2">
                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#F2B134] rounded-full" style={{ width: `${item.progress}%` }} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{item.progress}% complete</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Saved articles */}
      <section aria-labelledby="saved-heading">
        <h2 className="text-lg font-bold text-[#1B2A4A] mb-4" style={{ fontFamily: "var(--font-display)" }} id="saved-heading">
          Saved Articles
        </h2>
        <div className="space-y-3">
          {savedArticles.map((a) => (
            <Link key={a.id} href={`/articles/${a.slug}`} className="flex gap-3 bg-white rounded-xl border border-slate-100 p-3 hover:shadow-md transition-all group">
              <img src={a.featuredImage} alt={a.title} className="w-16 h-12 rounded-lg object-cover flex-shrink-0" loading="lazy" />
              <div>
                <h3 className="text-sm font-semibold text-[#1B2A4A] line-clamp-1 group-hover:text-[#2D4070]">{a.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{a.category} · {formatShortDate(a.publishedAt)}</p>
              </div>
              <Bookmark size={14} className="text-[#F2B134] ml-auto flex-shrink-0 mt-0.5" fill="currentColor" aria-hidden />
            </Link>
          ))}
        </div>
      </section>

      {/* Registered events */}
      <section aria-labelledby="events-heading">
        <h2 className="text-lg font-bold text-[#1B2A4A] mb-4" style={{ fontFamily: "var(--font-display)" }} id="events-heading">
          Registered Events
        </h2>
        <div className="space-y-3">
          {registeredEvents.map((ev) => (
            <div key={ev.id} className="flex items-center gap-4 bg-white rounded-xl border border-slate-100 p-4">
              <div className="text-center bg-[#FAF8F3] rounded-lg px-3 py-2 flex-shrink-0">
                <div className="text-lg font-bold text-[#1B2A4A]">{new Date(ev.date).getDate()}</div>
                <div className="text-xs text-slate-500 uppercase">{new Date(ev.date).toLocaleString("en-US", { month: "short" })}</div>
              </div>
              <div>
                <h3 className="font-semibold text-[#1B2A4A] text-sm">{ev.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{ev.isOnline ? "Online" : ev.location}</p>
              </div>
              <div className="ml-auto">
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">Registered</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Downloads */}
      <section aria-labelledby="downloads-heading">
        <h2 className="text-lg font-bold text-[#1B2A4A] mb-4" style={{ fontFamily: "var(--font-display)" }} id="downloads-heading">
          Download History
        </h2>
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          {downloadHistory.map((d, i) => (
            <div key={d.title} className={`flex items-center gap-3 p-4 ${i !== 0 ? "border-t border-slate-100" : ""}`}>
              <Download size={16} className="text-slate-400 flex-shrink-0" aria-hidden />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1B2A4A] line-clamp-1">{d.title}</p>
                <p className="text-xs text-slate-400">{formatShortDate(d.date)} · {d.size}</p>
              </div>
              <button className="text-xs font-semibold text-[#1B2A4A] hover:text-[#F2B134] transition-colors flex-shrink-0">
                Re-download
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Sign out */}
      <div className="pt-4 border-t border-slate-100">
        <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-500 transition-colors">
          <LogOut size={16} aria-hidden />
          Sign Out
        </button>
      </div>
    </div>
  );
}
