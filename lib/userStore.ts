import { put, list } from "@vercel/blob";

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

function safeEmail(email: string): string {
  return email
    .toLowerCase()
    .replace(/@/g, "_at_")
    .replace(/\./g, "_dot_")
    .replace(/[^a-z0-9_-]/g, "_");
}

async function pbkdf2Hash(password: string, saltHex?: string): Promise<string> {
  const encoder = new TextEncoder();
  const saltBuffer = saltHex
    ? Uint8Array.from(Buffer.from(saltHex, "hex"))
    : crypto.getRandomValues(new Uint8Array(16));

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const derivedBits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: saltBuffer, iterations: 100_000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  const hash = Buffer.from(derivedBits).toString("hex");
  const salt = Buffer.from(saltBuffer).toString("hex");
  return `${salt}:${hash}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex] = stored.split(":");
  if (!saltHex) return false;
  const candidate = await pbkdf2Hash(password, saltHex);
  return candidate === stored;
}

export async function getUserByEmail(email: string): Promise<UserAccount | null> {
  const id = safeEmail(email);
  const { blobs } = await list({ prefix: `iyg/users/${id}.json` });
  if (blobs.length === 0) return null;
  try {
    const res = await fetch(blobs[0].url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as UserAccount;
  } catch {
    return null;
  }
}

export async function createUser(
  email: string,
  name: string,
  password: string
): Promise<UserAccount> {
  const id = safeEmail(email);
  const passwordHash = await pbkdf2Hash(password);
  const user: UserAccount = {
    id,
    email: email.toLowerCase().trim(),
    name: name.trim(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  await put(`iyg/users/${id}.json`, JSON.stringify(user), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
  return user;
}
