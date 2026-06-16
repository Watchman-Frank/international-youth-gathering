import { NextResponse } from "next/server";
import { getUserByEmail, createUser } from "@/lib/userStore";

export async function POST(request: Request) {
  const { name, email, password } = await request.json() as {
    name: string;
    email: string;
    password: string;
  };

  if (!name?.trim())       return NextResponse.json({ error: "Name is required." }, { status: 400 });
  if (!email?.trim())      return NextResponse.json({ error: "Email is required." }, { status: 400 });
  if (!password || password.length < 8)
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });

  const existing = await getUserByEmail(email);
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists. Please sign in instead." },
      { status: 409 }
    );
  }

  await createUser(email, name, password);
  return NextResponse.json({ ok: true });
}
