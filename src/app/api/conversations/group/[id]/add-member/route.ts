import { getAuthUser } from "@/lib/auth";
import connectDB from "@/lib/database";
import Conversation from "@/models/Conversation";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, context: { params: { id: string }}) {
    await connectDB();

    const { id } = context.params;
    const { memberIds } = await req.json();
    const user = getAuthUser(req);

    if(!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const groupConversation = await Conversation.findById(id);
    if(!groupConversation || groupConversation.chatType !== "group") {
        return NextResponse.json({ error: "Group conversation not found." }, { status : 404 });
    }

    if(!groupConversation.admins.includes(user.user_id)) {
        return NextResponse.json({ error: "Only admins can add members to the group." }, { status: 403 });
    }

    if(!memberIds || !Array.isArray(memberIds)) {
        return NextResponse.json({ error: "Member IDs are required to add members." }, { status: 400 });
    }

    const uniqueIds = memberIds.filter((memberId: string) => !groupConversation.participants.includes(memberId));
    groupConversation.participants.push(...uniqueIds);
    await groupConversation.save();

    return NextResponse.json({ user, conversation: groupConversation }, { status: 200 });
}