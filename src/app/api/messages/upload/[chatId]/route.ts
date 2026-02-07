import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request, { params }: { params: { chatId: string } }) {
    try {
        const chatId = params.chatId;
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(process.cwd(), "uploads", "attachments", chatId);

        await mkdir(uploadDir, { recursive: true });

        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadDir, fileName);

        await writeFile(filePath, buffer);

        return NextResponse.json({
            url: `/uploads/attachments/${chatId}/${fileName}`,
            mimeType: file.type,
            size: file.size,
        });
    } catch (err) {
        console.error("UPLOAD ERROR:", err);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
