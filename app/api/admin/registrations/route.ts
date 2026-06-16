import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { checkAdminAuth, isSuperAdmin } from "@/lib/roles";
import { listRecords } from "@/lib/blobStore";
import type { Registration } from "@/app/api/registrations/route";
import type { NextRequest } from "next/server";
import type { Session } from "next-auth";

async function isAuthorized(req: NextRequest, session: Session | null) {
  return (await checkAdminAuth(req)) || isSuperAdmin(session);
}

function toCSV(registrations: Registration[]): string {
  const headers = ["Name", "Email", "Country", "Phone", "Registered At"];
  const rows = registrations.map((r) => [
    `${r.firstName} ${r.lastName}`,
    r.email,
    r.country,
    r.phone ?? "",
    new Date(r.registeredAt).toLocaleString("en-GB"),
  ]);
  return [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

export async function GET(request: NextRequest) {
  const session = await auth() as Session | null;
  if (!await isAuthorized(request, session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId");

  if (!eventId) {
    return NextResponse.json({ error: "eventId required" }, { status: 400 });
  }

  const registrations = await listRecords<Registration>(`registrations/${eventId}`);
  registrations.sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());

  if (searchParams.get("format") === "csv") {
    return new Response(toCSV(registrations), {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="registrations-${eventId}.csv"`,
      },
    });
  }

  return NextResponse.json({ registrations });
}
