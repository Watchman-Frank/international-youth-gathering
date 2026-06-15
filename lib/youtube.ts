import { unstable_cache } from "next/cache";

const API_BASE = "https://www.googleapis.com/youtube/v3";

function apiKey()      { return process.env.YOUTUBE_API_KEY ?? ""; }
function channelId()   { return process.env.YOUTUBE_CHANNEL_ID ?? ""; }
function uploadsId()   { return process.env.YOUTUBE_UPLOADS_PLAYLIST_ID ?? ""; }
function channelHandle() { return process.env.YOUTUBE_CHANNEL_HANDLE ?? "InternationalYouthGathering"; }

export interface YTVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  duration: number; // seconds
}

/* ── Helpers ─────────────────────────────────────── */

function parseDuration(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return (parseInt(m[1] ?? "0") * 3600) +
         (parseInt(m[2] ?? "0") * 60) +
          parseInt(m[3] ?? "0");
}

function bestThumb(t: any, id: string): string {
  return t?.maxres?.url ?? t?.high?.url ?? t?.medium?.url ?? t?.default?.url
    ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

// Batch-fetch video durations — 1 API unit per 50 IDs
async function fetchDurations(ids: string[]): Promise<Record<string, number>> {
  if (!apiKey() || !ids.length) return {};
  const res = await fetch(
    `${API_BASE}/videos?part=contentDetails&id=${ids.join(",")}&key=${apiKey()}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return {};
  const json = await res.json();
  const map: Record<string, number> = {};
  for (const item of json.items ?? []) {
    map[item.id] = parseDuration(item.contentDetails?.duration ?? "");
  }
  return map;
}

/* ── Resolve handle → channel ID (only needed if env var not set) ── */
const resolveChannelId = unstable_cache(
  async (): Promise<string> => {
    if (channelId()) return channelId();          // use pre-configured value
    if (!apiKey()) return "";
    const res = await fetch(
      `${API_BASE}/channels?part=id&forHandle=${encodeURIComponent(channelHandle())}&key=${apiKey()}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return "";
    const json = await res.json();
    return json.items?.[0]?.id ?? "";
  },
  ["iyg-channel-id"],
  { revalidate: 86400 }
);

/* ── Resolve channel ID → uploads playlist ID ────── */
const resolveUploadsPlaylist = unstable_cache(
  async (): Promise<string> => {
    if (uploadsId()) return uploadsId();          // use pre-configured value
    const cId = await resolveChannelId();
    if (!apiKey() || !cId) return "";
    const res = await fetch(
      `${API_BASE}/channels?part=contentDetails&id=${cId}&key=${apiKey()}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return "";
    const json = await res.json();
    return json.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ?? "";
  },
  ["iyg-uploads-playlist"],
  { revalidate: 86400 }
);

/* ── Fetch a single page of playlist items ───────── */
async function fetchPlaylistPage(
  playlistId: string,
  pageToken = "",
  maxResults = 50
): Promise<{ items: YTVideo[]; nextPageToken: string }> {
  const url =
    `${API_BASE}/playlistItems?part=snippet&playlistId=${playlistId}` +
    `&maxResults=${maxResults}${pageToken ? `&pageToken=${pageToken}` : ""}` +
    `&key=${apiKey()}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return { items: [], nextPageToken: "" };
  const json = await res.json();
  const raw = json.items ?? [];
  const ids = raw.map((i: any) => i.snippet?.resourceId?.videoId).filter(Boolean);
  const durations = await fetchDurations(ids);
  const items: YTVideo[] = raw.map((item: any) => {
    const vid = item.snippet?.resourceId?.videoId ?? "";
    return {
      id: vid,
      title: item.snippet?.title ?? "",
      description: item.snippet?.description ?? "",
      thumbnailUrl: bestThumb(item.snippet?.thumbnails, vid),
      publishedAt: item.snippet?.publishedAt ?? "",
      duration: durations[vid] ?? 0,
    };
  });
  return { items, nextPageToken: json.nextPageToken ?? "" };
}

/* ── Fetch ALL uploads (paginated, cached 1 h) ───── */
export const getAllUploads = unstable_cache(
  async (limit = 200): Promise<YTVideo[]> => {
    const pid = await resolveUploadsPlaylist();
    if (!apiKey() || !pid) return [];

    const all: YTVideo[] = [];
    let token = "";
    while (all.length < limit) {
      const { items, nextPageToken } = await fetchPlaylistPage(pid, token, 50);
      all.push(...items);
      if (!nextPageToken) break;
      token = nextPageToken;
    }
    return all.slice(0, limit);
  },
  ["iyg-all-uploads"],
  { revalidate: 3600 }
);

/* ── Fetch a specific playlist (cached 1 h) ──────── */
export const getPlaylistVideos = unstable_cache(
  async (playlistId: string, limit = 50): Promise<YTVideo[]> => {
    if (!apiKey() || !playlistId) return [];
    const all: YTVideo[] = [];
    let token = "";
    while (all.length < limit) {
      const { items, nextPageToken } = await fetchPlaylistPage(
        playlistId,
        token,
        Math.min(50, limit - all.length)
      );
      all.push(...items);
      if (!nextPageToken) break;
      token = nextPageToken;
    }
    return all;
  },
  ["iyg-playlist-videos"],
  { revalidate: 3600 }
);

/* ── Public: "Word For The Day" devotional videos ── */
export async function getDevotionalVideos(): Promise<YTVideo[]> {
  // Prefer dedicated playlist named "Word For The Day"
  const pid = process.env.YOUTUBE_DEVOTIONAL_PLAYLIST_ID;
  if (pid) return getPlaylistVideos(pid, 100);

  // Fall back: filter uploads by title keywords matching the playlist name
  const all = await getAllUploads();
  return all.filter((v) => {
    const t = v.title.toLowerCase();
    return (
      t.includes("word for the day") ||
      t.includes("word for today") ||
      t.includes("wftd")
    );
  });
}

/* ── Public: "GodLife Conference" session videos ─── */
export async function getConferenceVideos(): Promise<YTVideo[]> {
  // Prefer dedicated playlist named "GodLife Conference"
  const pid = process.env.YOUTUBE_CONFERENCE_PLAYLIST_ID;
  if (pid) return getPlaylistVideos(pid, 100);

  // Fall back: filter uploads by title keywords matching the playlist name
  const all = await getAllUploads();
  return all.filter((v) => {
    const t = v.title.toLowerCase();
    return (
      t.includes("godlife conference") ||
      t.includes("god-life conference") ||
      t.includes("godlife") ||
      t.includes("god life conference")
    );
  });
}
