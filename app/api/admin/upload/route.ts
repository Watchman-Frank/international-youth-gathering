import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

async function isAdminAuthed(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("iyg_admin")?.value;
  if (!token) return false;
  if (token === process.env.ADMIN_TOKEN) return true;
  // Appointed admin cookie format: "appointed:{email}:{code}"
  if (token.startsWith("appointed:") && token.split(":").length === 3) return true;
  return false;
}

export async function POST(request: Request): Promise<Response> {
  if (!await isAdminAuthed()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname) => {
        return {
          allowedContentTypes: [
            "image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml",
            "video/mp4", "video/quicktime", "video/webm", "video/avi", "video/mkv",
            "audio/mpeg", "audio/wav", "audio/ogg", "audio/aac",
            "application/pdf",
          ],
          maximumSizeInBytes: 2 * 1024 * 1024 * 1024, // 2 GB
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // Metadata is saved separately by the client via /api/admin/media-posts
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
