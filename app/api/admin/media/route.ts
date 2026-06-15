import { list } from "@vercel/blob";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("iyg_admin");
  if (!token || token.value !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { blobs } = await list({ prefix: "iyg/" });
  return NextResponse.json({ blobs });
}

export async function DELETE(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("iyg_admin");
  if (!token || token.value !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url } = await request.json();
  const { del } = await import("@vercel/blob");
  await del(url);
  return NextResponse.json({ ok: true });
}
