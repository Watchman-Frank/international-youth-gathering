import type { NextRequest } from "next/server";

interface SessionLike {
  user?: { role?: string; email?: string | null } | null;
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
