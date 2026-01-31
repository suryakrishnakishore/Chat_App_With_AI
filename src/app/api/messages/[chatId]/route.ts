import { getAuthUser } from "@/lib/auth";
import connectDB from "@/lib/database";
import Message from "@/models/Message";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { chatId: string }}) {
    await connectDB();

    const chatId = params.chatId;
    const user = getAuthUser(req);
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const beforeParam = searchParams.get("before");
    const limitParam = searchParams.get("limit");

    if(!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const messages = await Message.find({ chatId, timestamp: { $lt: beforeParam} }).sort({ timestamp: -1 }).limit(limitParam ? parseInt(limitParam) : 50);

        return NextResponse.json({ messages }, { status: 200 });
    } catch (error: any) {
        console.log("Error fetching messages: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status:500 });
    }
}