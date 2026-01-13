import { NextResponse } from "next/server";
import path from "path";
import { readFile } from "fs/promises";

export async function GET(
  req: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = path.join(
      process.cwd(),
      "uploads",
      ...params.path
    );

    const imageBuffer = await readFile(filePath);

    return new NextResponse(imageBuffer, {
      headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=31536000", },
    });
  } catch (err) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
        