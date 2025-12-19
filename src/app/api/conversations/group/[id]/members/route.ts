import connectDB from "@/lib/database";
import Conversation from "@/models/Conversation";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, context: { params: { id: string }}) {
    await connectDB();

    const { id } = context.params;

    const groupConversation = await Conversation.findById(id);
    if(!groupConversation || groupConversation.chatType !== "group") {
        return NextResponse.json({ error: "Group conversation not found." }, { status : 404 });
    }

    return NextResponse.json({ members: groupConversation.participants }, { status: 200 });
}