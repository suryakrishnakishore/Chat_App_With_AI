import { NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";

export async function GET(
  req: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = path.join(process.cwd(), "uploads", ...params.path);

    // Ensure file exists
    await stat(filePath);

    const fileBuffer = await readFile(filePath);

    // Detect extension
    const ext = filePath.split(".").pop()?.toLowerCase();
    console.log("File extension: ", ext);
    
    const mimeMap: Record<string, string> = {
      pdf: "application/pdf",
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      gif: "image/gif",
      webp: "image/webp",
      mp4: "video/mp4",
      mp3: "audio/mpeg",
      wav: "audio/wav",
      mov: "video/quicktime",
      zip: "application/zip",
      txt: "text/plain",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      json: "application/json",
    };

    const mimeType = mimeMap[ext || ""] || "application/octet-stream";

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000",
        "Content-Disposition": "inline",
      },
    });
  } catch (err) {
    console.error("File Serve Error:", err);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}

        