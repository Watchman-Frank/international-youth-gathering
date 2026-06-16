import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { putRecord, listRecords } from "@/lib/blobStore";
import { checkAdminCookie, isSuperAdmin } from "@/lib/roles";
import type { ArticleSubmission } from "@/app/api/submissions/route";
import type { NextRequest } from "next/server";
import type { Session } from "next-auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth() as Session | null;
  if (!checkAdminCookie(request) && !isSuperAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { action, comment } = body as { action: "approve" | "reject"; comment: string };

  // Find the submission record
  const all = await listRecords<ArticleSubmission>("submissions");
  const submission = all.find((s) => s.id === id);
  if (!submission) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }

  const updated: ArticleSubmission = {
    ...submission,
    status: action === "approve" ? "approved" : "rejected",
    reviewComment: comment,
    reviewedAt: new Date().toISOString(),
  };

  await putRecord("submissions", id, updated);

  return NextResponse.json({ ok: true, submission: updated });
}
