import type { NextRequest } from "next/server";
import { listRecords } from "@/lib/blobStore";

interface SessionLike {
  user?: { role?: string; email?: string | null } | null;
}

export interface AdminMember {
  id: string;
  email: string;
  name: string;
  code: string;
  active: boolean;
  appointedAt: string;
  appointedBy: string;
}

export function isSuperAdmin(session: SessionLike | null | undefined): boolean {
  return (session?.user as { role?: string } | undefined)?.role === "superadmin";
}

export function isAdminUser(session: SessionLike | null | undefined): boolean {
  const role = (session?.user as { role?: string } | undefined)?.role;
  return role === "superadmin" || role === "admin";
}

export function checkAdminCookie(req: NextRequest): boolean {
  return req.cookies.get("iyg_admin")?.value === process.env.ADMIN_TOKEN;
}

export async function checkAdminAuth(req: NextRequest): Promise<boolean> {
  const cookie = req.cookies.get("iyg_admin")?.value;
  if (!cookie) return false;
  if (cookie === process.env.ADMIN_TOKEN) return true;
  if (cookie.startsWith("appointed:")) {
    const parts = cookie.split(":");
    const email = parts[1];
    const code = parts[2];
    if (!email || !code) return false;
    try {
      const members = await listRecords<AdminMember>("admins/team");
      return members.some((m) => m.email === email && m.code === code && m.active);
    } catch {
      return false;
    }
  }
  return false;
}
