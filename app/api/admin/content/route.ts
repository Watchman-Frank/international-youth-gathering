import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { checkAdminAuth, isSuperAdmin } from "@/lib/roles";
import { putRecord, getRecord } from "@/lib/blobStore";
import type { NextRequest } from "next/server";
import type { Session } from "next-auth";

export interface SiteContent {
  about?: {
    heroTitle?: string;
    heroSubtitle?: string;
    missionStatement?: string;
    visionStatement?: string;
    additionalText?: string;
  };
  give?: {
    heroTitle?: string;
    heroSubtitle?: string;
    bankDetails?: string;
    paypalLink?: string;
    cashappLink?: string;
    additionalGiveText?: string;
  };
  updatedAt?: string;
}

export async function GET() {
  const content = await getRecord<SiteContent>("content", "site");
  return NextResponse.json({ content: content ?? {} });
}

export async function PATCH(request: NextRequest) {
  const session = (await auth()) as Session | null;
  if (!(await checkAdminAuth(request)) && !isSuperAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json() as Partial<SiteContent>;
  const existing = (await getRecord<SiteContent>("content", "site")) ?? {};
  const updated: SiteContent = {
    ...existing,
    ...(body.about !== undefined ? { about: { ...existing.about, ...body.about } } : {}),
    ...(body.give !== undefined ? { give: { ...existing.give, ...body.give } } : {}),
    updatedAt: new Date().toISOString(),
  };
  await putRecord("content", "site", updated);
  return NextResponse.json({ ok: true, content: updated });
}
