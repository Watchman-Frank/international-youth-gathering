import { NextResponse } from "next/server";
import { getAllUploads } from "@/lib/youtube";

export async function GET(request: Request) {
  if (!process.env.YOUTUBE_API_KEY) {
    return NextResponse.json({ videos: [], configured: false });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "9"), 18);

  try {
    const all = await getAllUploads(limit);
    return NextResponse.json(
      { videos: all.slice(0, limit), configured: true },
      { headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" } }
    );
  } catch {
    return NextResponse.json({ videos: [], configured: true, error: true }, { status: 500 });
  }
}
