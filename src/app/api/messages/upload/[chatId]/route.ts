import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request, { params }: { params: { chatId: string } }) {
    try {
        const formData = await req.formData();
        const file: File | null = formData.get("file") as unknown as File;
        const chatId = await params.chatId;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(process.cwd(), "uploads", "attachments", chatId, fileName);

        await writeFile(filePath, buffer);

        return NextResponse.json({
            url: `/uploads/attachments/${chatId}/${fileName}`,
            fileName,
            fileType: file.type,
            size: file.size
        });
    } catch (err: any) {
        console.log("Error while uploading attachments.", err);
        return NextResponse.json({
            message: "Internal Server Error",
        }, { status: 500 });
    }
}
