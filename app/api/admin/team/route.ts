import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isSuperAdmin } from "@/lib/roles";
import { putRecord, listRecords } from "@/lib/blobStore";
import { randomUUID } from "crypto";
import type { AdminMember } from "@/lib/roles";
import type { Session } from "next-auth";
import type { NextRequest } from "next/server";

function isSuperAdminOrMasterCookie(session: Session | null, req: NextRequest): boolean {
  return isSuperAdmin(session) || req.cookies.get("iyg_admin")?.value === process.env.ADMIN_TOKEN;
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export async function GET(request: NextRequest) {
  const session = (await auth()) as Session | null;
  if (!isSuperAdminOrMasterCookie(session, request)) {
    return NextResponse.json({ error: "Superadmin only" }, { status: 403 });
  }
  const members = await listRecords<AdminMember>("admins/team");
  members.sort((a, b) => new Date(b.appointedAt).getTime() - new Date(a.appointedAt).getTime());
  return NextResponse.json({ members });
}

export async function POST(request: NextRequest) {
  const session = (await auth()) as Session | null;
  if (!isSuperAdminOrMasterCookie(session, request)) {
    return NextResponse.json({ error: "Superadmin only" }, { status: 403 });
  }
  const { email, name } = (await request.json()) as { email: string; name: string };
  if (!email || !name) return NextResponse.json({ error: "Email and name required" }, { status: 400 });

  const existing = await listRecords<AdminMember>("admins/team");
  if (existing.some((m) => m.email.toLowerCase() === email.toLowerCase() && m.active)) {
    return NextResponse.json({ error: "This email is already an active admin" }, { status: 409 });
  }

  const member: AdminMember = {
    id: randomUUID(),
    email,
    name,
    code: generateCode(),
    active: true,
    appointedAt: new Date().toISOString(),
    appointedBy: session?.user?.email ?? "superadmin",
  };
  await putRecord("admins/team", member.id, member);
  return NextResponse.json({ ok: true, member });
}

export async function DELETE(request: NextRequest) {
  const session = (await auth()) as Session | null;
  if (!isSuperAdminOrMasterCookie(session, request)) {
    return NextResponse.json({ error: "Superadmin only" }, { status: 403 });
  }
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const members = await listRecords<AdminMember>("admins/team");
  const member = members.find((m) => m.id === id);
  if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });

  await putRecord("admins/team", id, { ...member, active: false });
  return NextResponse.json({ ok: true });
}
