import type { Resource } from "@/lib/types";

export const resources: Resource[] = [
  {
    id: "r1",
    title: "The Intercessor's Guide: 30 Days of Strategic Prayer",
    description:
      "A structured 30-day prayer guide for young intercessors. Includes scripture-based declarations, targeted prayer points for nations, and space for journaling prophetic insights.",
    type: "pdf",
    topic: "Prayer",
    isFree: true,
    downloadUrl: "#download",
    thumbnailUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    publishedAt: "2026-04-01T00:00:00Z",
    fileSize: "2.4 MB",
    downloads: 3241,
  },
  {
    id: "r2",
    title: "Youth Ministry Leadership Toolkit",
    description:
      "Everything a young leader needs to start and run a thriving youth ministry: session plans, small group guides, event planning templates, and accountability frameworks.",
    type: "guide",
    topic: "Youth Ministry",
    isFree: false,
    externalUrl: "#buy",
    price: "$24.99",
    thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
    publishedAt: "2026-03-15T00:00:00Z",
    downloads: 892,
  },
  {
    id: "r3",
    title: "Prophetic Foundations: Understanding Your Gift",
    description:
      "A biblical and practical guide to understanding the prophetic gift — how to steward it, test it, and walk in it with accountability and humility.",
    type: "ebook",
    topic: "Prophetic",
    isFree: true,
    downloadUrl: "#download",
    thumbnailUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop",
    publishedAt: "2026-02-10T00:00:00Z",
    fileSize: "1.8 MB",
    downloads: 2187,
  },
  {
    id: "r4",
    title: "Evangelism in the Digital Age",
    description:
      "How to share the gospel effectively through social media, content creation, and online community building. Practical strategies for digital missionaries.",
    type: "guide",
    topic: "Evangelism",
    isFree: true,
    downloadUrl: "#download",
    thumbnailUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=300&fit=crop",
    publishedAt: "2026-01-20T00:00:00Z",
    fileSize: "1.2 MB",
    downloads: 1456,
  },
  {
    id: "r5",
    title: "Spiritual Disciplines for a Busy Life: 12-Week Study",
    description:
      "A comprehensive 12-week personal or small-group study on building sustainable spiritual rhythms: prayer, fasting, scripture meditation, sabbath, and community.",
    type: "study",
    topic: "Spiritual Growth",
    isFree: false,
    externalUrl: "#buy",
    price: "$14.99",
    thumbnailUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
    publishedAt: "2025-11-05T00:00:00Z",
    downloads: 2341,
  },
  {
    id: "r6",
    title: "Leading with Biblical Intelligence: A Workshop Recording",
    description:
      "Full recording of our leadership workshop with Pastor Emmanuel. Covers servant leadership, spiritual authority, team building, and navigating conflict in ministry.",
    type: "video",
    topic: "Leadership",
    isFree: true,
    downloadUrl: "#download",
    thumbnailUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop",
    publishedAt: "2025-10-12T00:00:00Z",
    fileSize: "840 MB",
    downloads: 1876,
  },
];

export const topics = [
  "All",
  "Prayer",
  "Leadership",
  "Evangelism",
  "Bible Study",
  "Worship",
  "Spiritual Growth",
  "Youth Ministry",
  "Prophetic",
] as const;

export const resourceTypes = ["All", "pdf", "guide", "study", "video", "audio", "ebook"] as const;
