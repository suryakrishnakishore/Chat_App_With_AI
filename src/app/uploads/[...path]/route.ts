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

    const image = await readFile(filePath);

    return new NextResponse(image, {
      headers: { "Content-Type": "image/jpeg" },
    });
  } catch (err) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
        