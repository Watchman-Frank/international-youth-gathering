import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  // Auth check
  const cookieStore = await cookies();
  const token = cookieStore.get("iyg_admin");
  if (!token || token.value !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Max 50 MB
  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 50 MB)" }, { status: 413 });
  }

  // Allowed types
  const allowed = [
    "image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml",
    "video/mp4", "video/quicktime", "video/webm",
    "application/pdf",
    "audio/mpeg", "audio/wav", "audio/ogg",
  ];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 415 });
  }

  const blob = await put(`iyg/${Date.now()}-${file.name}`, file, {
    access: "public",
    contentType: file.type,
  });

  return NextResponse.json(blob);
}
