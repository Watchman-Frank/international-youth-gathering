import { NextResponse } from "next/server";
import { listRecords } from "@/lib/blobStore";
import type { AdminMember } from "@/lib/roles";

export async function POST(request: Request) {
  const body = await request.json();
  const { password, email, code } = body as { password?: string; email?: string; code?: string };

  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken) {
    return NextResponse.json({ error: "Admin not configured" }, { status: 503 });
  }

  // Superadmin login (password only)
  if (password) {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) return NextResponse.json({ error: "Admin not configured" }, { status: 503 });
    if (password !== adminPassword) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set("iyg_admin", adminToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  }

  // Appointed admin login (email + access code)
  if (email && code) {
    const members = await listRecords<AdminMember>("admins/team");
    const member = members.find(
      (m) =>
        m.email.toLowerCase() === email.toLowerCase() &&
        m.code === code.toUpperCase() &&
        m.active
    );
    if (!member) {
      return NextResponse.json({ error: "Invalid email or access code" }, { status: 401 });
    }
    const cookieValue = `appointed:${member.email}:${member.code}`;
    const res = NextResponse.json({ ok: true });
    res.cookies.set("iyg_admin", cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  }

  return NextResponse.json({ error: "Password or email + access code required" }, { status: 400 });
}
