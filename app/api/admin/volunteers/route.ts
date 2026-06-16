import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { checkAdminAuth, isSuperAdmin } from "@/lib/roles";
import { listRecords } from "@/lib/blobStore";
import type { VolunteerApplication } from "@/app/api/volunteers/route";
import type { NextRequest } from "next/server";
import type { Session } from "next-auth";

export async function GET(request: NextRequest) {
  const session = (await auth()) as Session | null;
  if (!(await checkAdminAuth(request)) && !isSuperAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const volunteers = await listRecords<VolunteerApplication>("volunteers");
  volunteers.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  return NextResponse.json({ volunteers });
}
