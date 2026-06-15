import type { Event } from "@/lib/types";

export const events: Event[] = [
  {
    id: "1",
    slug: "god-life-conference-2026",
    title: "God-Life Conference 2026",
    type: "conference",
    description:
      "God-Life Conference is IYG's flagship annual gathering — days of intensive worship, apostolic teaching, prophetic activation, and supernatural encounters. This year's theme is RISE: a declaration that this generation is ascending in faith, authority, and excellence. Join us in person or online as we gather from around the world.",
    shortDescription: "IYG's flagship annual conference — days of worship, word, and prophetic activation.",
    date: "2026-08-14T09:00:00Z",
    endDate: "2026-08-17T22:00:00Z",
    location: "Greater New York Christian Centre, Binghamton, NY",
    isOnline: true,
    joinLink: "https://internationalyouthgathering.com/live",
    registerLink: "#register",
    watchLiveLink: "https://internationalyouthgathering.com/live",
    flyer: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=800&fit=crop",
    promoVideo: undefined,
    pastRecordings: [
      {
        id: "rec1",
        title: "God-Life Conference 2025 — Full Replay",
        thumbnailUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=340&fit=crop",
        youtubeId: "dQw4w9WgXcQ",
        duration: 14400,
        publishedAt: "2025-09-01T00:00:00Z",
      },
      {
        id: "rec2",
        title: "God-Life Conference 2024 — Highlights",
        thumbnailUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=340&fit=crop",
        youtubeId: "dQw4w9WgXcQ",
        duration: 5400,
        publishedAt: "2024-09-15T00:00:00Z",
      },
    ],
    isFeatured: true,
    requiresTicket: true,
    isUpcoming: true,
  },
  {
    id: "2",
    slug: "prayer-prophetic-party-july-4-2026",
    title: "Prayer & Prophetic Party — July 4th",
    type: "prayer-party",
    description:
      "Every US federal holiday, IYG holds a Prayer & Prophetic Party — a gathering of intercessors and prophetic voices to cover the nations in prayer. Join us online for powerful intercession, prophetic declarations, and Spirit-led worship as we use the nation's pause as an opportunity to advance the Kingdom.",
    shortDescription: "Intercession and prophetic ministry on US federal holidays.",
    date: "2026-07-04T14:00:00Z",
    endDate: "2026-07-04T18:00:00Z",
    location: undefined,
    isOnline: true,
    joinLink: "https://internationalyouthgathering.com/live",
    isFeatured: false,
    requiresTicket: false,
    isUpcoming: true,
    pastRecordings: [
      {
        id: "ppp1",
        title: "Prayer & Prophetic Party — Memorial Day 2026",
        thumbnailUrl: "https://images.unsplash.com/photo-1616531770192-6eaea74c2456?w=600&h=340&fit=crop",
        youtubeId: "dQw4w9WgXcQ",
        duration: 7200,
        publishedAt: "2026-05-27T00:00:00Z",
      },
      {
        id: "ppp2",
        title: "Prayer & Prophetic Party — Presidents Day 2026",
        thumbnailUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=340&fit=crop",
        youtubeId: "dQw4w9WgXcQ",
        duration: 6600,
        publishedAt: "2026-02-17T00:00:00Z",
      },
    ],
  },
  {
    id: "3",
    slug: "prayer-prophetic-party-labor-day-2026",
    title: "Prayer & Prophetic Party — Labor Day",
    type: "prayer-party",
    description:
      "Join the IYG prayer family for our Labor Day Prayer & Prophetic Party. A time of intercession for workers, systems, and nations.",
    shortDescription: "Intercession and prophetic declarations to close out the summer.",
    date: "2026-09-07T14:00:00Z",
    endDate: "2026-09-07T18:00:00Z",
    isOnline: true,
    joinLink: "https://internationalyouthgathering.com/live",
    requiresTicket: false,
    isUpcoming: true,
  },
  {
    id: "4",
    slug: "god-life-conference-2025-replay",
    title: "God-Life Conference 2025 — Watch Replay",
    type: "conference",
    description:
      "Missed God-Life 2025? Catch the full conference replay including all main sessions, worship nights, and prophetic activations.",
    shortDescription: "Full replay of God-Life Conference 2025.",
    date: "2025-08-15T00:00:00Z",
    isOnline: true,
    isUpcoming: false,
    pastRecordings: [
      {
        id: "glc2025-1",
        title: "Opening Night Worship — God-Life 2025",
        thumbnailUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=340&fit=crop",
        youtubeId: "dQw4w9WgXcQ",
        duration: 5400,
        publishedAt: "2025-08-15T00:00:00Z",
      },
      {
        id: "glc2025-2",
        title: "Apostolic Teaching: The Mandate — Pastor Emmanuel",
        thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=340&fit=crop",
        youtubeId: "dQw4w9WgXcQ",
        duration: 4200,
        publishedAt: "2025-08-16T00:00:00Z",
      },
    ],
  },
];

export const upcomingEvents = events.filter((e) => e.isUpcoming);
export const pastEvents = events.filter((e) => !e.isUpcoming);

export const prayerPartyDates = [
  { date: "2026-07-04", name: "Independence Day" },
  { date: "2026-09-07", name: "Labor Day" },
  { date: "2026-11-26", name: "Thanksgiving" },
  { date: "2026-12-25", name: "Christmas Day" },
  { date: "2027-01-01", name: "New Year's Day" },
  { date: "2027-01-19", name: "MLK Day" },
];
