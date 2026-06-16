import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { del } from "@vercel/blob";
import { putRecord, listRecords, getRecord } from "@/lib/blobStore";

export interface MediaPost {
  id: string;
  title: string;
  about: string;
  fileUrl: string;
  contentType: string;
  fileSize: number;
  uploadedAt: string;
}

async function isAdminAuthed(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("iyg_admin")?.value;
  if (!token) return false;
  if (token === process.env.ADMIN_TOKEN) return true;
  if (token.startsWith("appointed:") && token.split(":").length === 3) return true;
  return false;
}

export async function GET() {
  if (!await isAdminAuthed()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const posts = await listRecords<MediaPost>("media-posts");
  const sorted = posts.sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );
  return NextResponse.json({ posts: sorted });
}

export async function POST(request: NextRequest) {
  if (!await isAdminAuthed()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json() as {
    title: string;
    about?: string;
    fileUrl: string;
    contentType: string;
    fileSize: number;
  };

  if (!body.title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (!body.fileUrl) {
    return NextResponse.json({ error: "fileUrl is required" }, { status: 400 });
  }

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const post: MediaPost = {
    id,
    title: body.title.trim(),
    about: body.about?.trim() ?? "",
    fileUrl: body.fileUrl,
    contentType: body.contentType,
    fileSize: body.fileSize,
    uploadedAt: new Date().toISOString(),
  };

  await putRecord("media-posts", id, post);
  return NextResponse.json({ post }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  if (!await isAdminAuthed()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, deleteFile } = await request.json() as { id: string; deleteFile?: boolean };
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  if (deleteFile) {
    const post = await getRecord<MediaPost>("media-posts", id);
    if (post?.fileUrl) {
      try { await del(post.fileUrl); } catch { /* blob may already be gone */ }
    }
  }

  // Delete the metadata record by overwriting with a tombstone, then re-listing
  // Vercel Blob doesn't support deleting JSON records directly, so we delete the blob file
  const { del: delBlob, list } = await import("@vercel/blob");
  const { blobs } = await list({ prefix: `iyg/media-posts/${id}.json` });
  for (const b of blobs) await delBlob(b.url);

  return NextResponse.json({ ok: true });
}
