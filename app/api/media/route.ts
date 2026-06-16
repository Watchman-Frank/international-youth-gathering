import { NextResponse } from "next/server";
import { listRecords } from "@/lib/blobStore";
import type { MediaPost } from "@/app/api/admin/media-posts/route";

export async function GET() {
  const posts = await listRecords<MediaPost>("media-posts");
  const sorted = posts.sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );
  return NextResponse.json({ posts: sorted });
}
