import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { putRecord } from "@/lib/blobStore";
import { randomUUID } from "crypto";

export interface Registration {
  id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phone?: string;
  registeredAt: string;
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in to register" }, { status: 401 });
  }

  const body = await request.json();
  const { eventId, eventTitle, firstName, lastName, email, country, phone } = body;

  if (!eventId || !eventTitle || !firstName || !lastName || !email || !country) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const id = randomUUID();
  const registration: Registration = {
    id,
    eventId,
    eventTitle,
    userId: session.user.id ?? session.user.email ?? "",
    firstName,
    lastName,
    email,
    country,
    phone: phone || undefined,
    registeredAt: new Date().toISOString(),
  };

  await putRecord(`registrations/${eventId}`, id, registration);

  return NextResponse.json({ ok: true, registration });
}
