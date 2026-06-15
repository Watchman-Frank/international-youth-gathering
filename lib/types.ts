export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  author: Author;
  category: ArticleCategory;
  featuredImage: string;
  publishedAt: string;
  readingTime: string;
  tags: string[];
  reactions: { likes: number; hearts: number };
  views: number;
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  role?: string;
}

export type ArticleCategory =
  | "Faith & Life"
  | "Devotional"
  | "Ministry"
  | "Youth Culture"
  | "Leadership"
  | "Prayer"
  | "Missions"
  | "Testimony";

export interface Event {
  id: string;
  slug: string;
  title: string;
  type: "conference" | "prayer-party" | "webinar" | "general";
  description: string;
  shortDescription: string;
  date: string;
  endDate?: string;
  location?: string;
  isOnline: boolean;
  joinLink?: string;
  registerLink?: string;
  watchLiveLink?: string;
  flyer?: string;
  promoVideo?: string;
  pastRecordings?: VideoItem[];
  isFeatured?: boolean;
  requiresTicket?: boolean;
  isUpcoming: boolean;
}

export interface VideoItem {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  videoUrl?: string;
  youtubeId?: string;
  duration: number;
  publishedAt: string;
  scripture?: string;
  category?: string;
  captions?: string;
}

export interface Devotional extends VideoItem {
  date: string;
  scriptureText?: string;
  summary?: string;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  showNotes?: string;
  thumbnailUrl: string;
  videoUrl?: string;
  youtubeId?: string;
  audioUrl?: string;
  duration: number;
  publishedAt: string;
  season?: number;
  episode?: number;
  guests?: string[];
  reactions: { likes: number; hearts: number };
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "guide" | "study" | "video" | "audio" | "ebook";
  topic: ResourceTopic;
  isFree: boolean;
  downloadUrl?: string;
  externalUrl?: string;
  price?: string;
  thumbnailUrl: string;
  publishedAt: string;
  fileSize?: string;
  downloads?: number;
}

export type ResourceTopic =
  | "Prayer"
  | "Leadership"
  | "Evangelism"
  | "Bible Study"
  | "Worship"
  | "Spiritual Growth"
  | "Youth Ministry"
  | "Prophetic";

export interface VolunteerRole {
  id: string;
  title: string;
  description: string;
  skills: string[];
  commitment: string;
  icon: string;
}

export interface Comment {
  id: string;
  author: Author;
  body: string;
  createdAt: string;
  likes: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  savedArticles: string[];
  registeredEvents: string[];
  downloadHistory: string[];
  watchProgress: Record<string, number>;
  joinedAt: string;
}
