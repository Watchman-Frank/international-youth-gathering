import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { checkAdminCookie, isSuperAdmin } from "@/lib/roles";
import { putRecord, listRecords, deleteRecord } from "@/lib/blobStore";
import { randomUUID } from "crypto";
import type { Resource } from "@/lib/types";
import type { NextRequest } from "next/server";
import type { Session } from "next-auth";

function authorized(req: NextRequest, session: Session | null) {
  return checkAdminCookie(req) || isSuperAdmin(session);
}

export async function GET(request: NextRequest) {
  const session = await auth() as Session | null;
  if (!authorized(request, session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const resources = await listRecords<Resource>("library");
  return NextResponse.json({ resources });
}

export async function POST(request: NextRequest) {
  const session = await auth() as Session | null;
  if (!authorized(request, session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const resource: Resource = { id: randomUUID(), ...body };
  await putRecord("library", resource.id, resource);
  return NextResponse.json({ ok: true, resource });
}

export async function DELETE(request: NextRequest) {
  const session = await auth() as Session | null;
  if (!authorized(request, session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await deleteRecord("library", id);
  return NextResponse.json({ ok: true });
}
