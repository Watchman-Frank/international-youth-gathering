import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const cookie = request.cookies.get("iyg_admin")?.value;
    const expected = process.env.ADMIN_TOKEN;

    const isSuperAdmin = expected && cookie === expected;
    const isAppointedAdmin = cookie?.startsWith("appointed:") && cookie.split(":").length === 3;

    if (!isSuperAdmin && !isAppointedAdmin) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
