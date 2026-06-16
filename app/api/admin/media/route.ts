import { list } from "@vercel/blob";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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
  const { blobs } = await list({ prefix: "iyg/" });
  return NextResponse.json({ blobs });
}

export async function DELETE(request: Request) {
  if (!await isAdminAuthed()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { url } = await request.json();
  const { del } = await import("@vercel/blob");
  await del(url);
  return NextResponse.json({ ok: true });
}
