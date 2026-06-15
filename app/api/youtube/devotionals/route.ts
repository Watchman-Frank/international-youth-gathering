import { NextResponse } from "next/server";
import { getDevotionalVideos } from "@/lib/youtube";

export async function GET() {
  if (!process.env.YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY === "your_youtube_api_key_here") {
    return NextResponse.json(
      { videos: [], configured: false },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const videos = await getDevotionalVideos();
    return NextResponse.json(
      { videos, configured: true },
      { headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" } }
    );
  } catch {
    return NextResponse.json({ videos: [], configured: true, error: true }, { status: 500 });
  }
}
