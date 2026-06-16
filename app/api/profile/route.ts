import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { putRecord, getRecord } from "@/lib/blobStore";

export interface UserProfile {
  userId: string;
  email: string;
  officialName: string;
  username: string;
  bio: string;
  avatarUrl?: string;
  updatedAt: string;
}

function safeId(userId: string): string {
  return userId.replace(/@/g, "_at_").replace(/\./g, "_dot_").replace(/[^a-zA-Z0-9_-]/g, "_");
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = safeId(session.user.email ?? session.user.id ?? "unknown");
  const profile = await getRecord<UserProfile>("users", id);
  return NextResponse.json({ profile: profile ?? null });
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = safeId(session.user.email ?? session.user.id ?? "unknown");
  const body = await request.json();
  const { officialName, username, bio, avatarUrl } = body as Partial<UserProfile>;

  const existing = (await getRecord<UserProfile>("users", id)) ?? ({} as Partial<UserProfile>);
  const updated: UserProfile = {
    userId: session.user.id ?? session.user.email ?? "",
    email: session.user.email ?? "",
    officialName: officialName ?? existing.officialName ?? session.user.name ?? "",
    username: username ?? existing.username ?? "",
    bio: bio ?? existing.bio ?? "",
    avatarUrl: avatarUrl !== undefined ? avatarUrl : (existing.avatarUrl ?? session.user.image ?? undefined),
    updatedAt: new Date().toISOString(),
  };
  await putRecord("users", id, updated);
  return NextResponse.json({ ok: true, profile: updated });
}
