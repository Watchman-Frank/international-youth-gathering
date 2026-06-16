import { NextResponse } from "next/server";
import { putRecord } from "@/lib/blobStore";
import { randomUUID } from "crypto";

export interface VolunteerApplication {
  id: string;
  name: string;
  email: string;
  role: string;
  portfolio?: string;
  message: string;
  submittedAt: string;
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, role, portfolio, message } = body as Partial<VolunteerApplication>;

  if (!name || !email || !role || !message) {
    return NextResponse.json({ error: "Name, email, role and message are required" }, { status: 400 });
  }

  const id = randomUUID();
  const application: VolunteerApplication = {
    id,
    name,
    email,
    role,
    portfolio: portfolio || undefined,
    message,
    submittedAt: new Date().toISOString(),
  };
  await putRecord("volunteers", id, application);
  return NextResponse.json({ ok: true });
}
