import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { put } from "@vercel/blob";

function safeId(userId: string): string {
  return userId.replace(/@/g, "_at_").replace(/\./g, "_dot_").replace(/[^a-zA-Z0-9_-]/g, "_");
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("avatar") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG, WebP, or GIF images are allowed" }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Image must be under 5MB" }, { status: 400 });
  }

  const ext = file.type.split("/")[1] ?? "jpg";
  const id = safeId(session.user.email ?? session.user.id ?? "unknown");
  const key = `iyg/avatars/${id}.${ext}`;

  const { url } = await put(key, file, { access: "public", addRandomSuffix: false });
  return NextResponse.json({ ok: true, url });
}
