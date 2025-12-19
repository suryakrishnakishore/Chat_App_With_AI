import { getAuthUser } from "@/lib/auth";
import connectDB from "@/lib/database";
import Conversation from "@/models/Conversation";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    await connectDB();
    const user = getAuthUser(req);

    const conversations = await Conversation.find({ participants: user.userId });

    return NextResponse.json({ conversations }, { status: 200 });
}
