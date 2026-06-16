import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { putRecord, listRecords } from "@/lib/blobStore";
import { checkAdminAuth, isSuperAdmin } from "@/lib/roles";
import { randomUUID } from "crypto";
import type { NextRequest } from "next/server";
import type { Session } from "next-auth";

export interface ArticleSubmission {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  tags: string[];
  pdfUrl?: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  authorAvatar?: string;
  status: "pending" | "approved" | "rejected";
  reviewComment?: string;
  reviewedAt?: string;
  submittedAt: string;
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in to submit articles" }, { status: 401 });
  }

  const body = await request.json();
  const { title, excerpt, body: articleBody, category, tags, pdfUrl } = body;

  if (!title || !excerpt || !category) {
    return NextResponse.json({ error: "Title, excerpt and category are required" }, { status: 400 });
  }

  const id = randomUUID();
  const submission: ArticleSubmission = {
    id,
    title,
    excerpt,
    body: articleBody ?? "",
    category,
    tags: tags ?? [],
    pdfUrl: pdfUrl || undefined,
    authorId: session.user.id ?? session.user.email ?? "",
    authorName: session.user.name ?? "Anonymous",
    authorEmail: session.user.email ?? "",
    authorAvatar: session.user.image ?? undefined,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };

  await putRecord("submissions", id, submission);

  return NextResponse.json({ ok: true, id });
}

export async function GET(request: NextRequest) {
  const session = await auth() as Session | null;
  if (!await checkAdminAuth(request) && !isSuperAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const submissions = await listRecords<ArticleSubmission>("submissions");
  submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  return NextResponse.json({ submissions });
}
