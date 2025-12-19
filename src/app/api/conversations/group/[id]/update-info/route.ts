import { getAuthUser } from "@/lib/auth";
import connectDB from "@/lib/database";
import { saveImage } from "@/lib/saveImage";
import Conversation from "@/models/Conversation";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, context: { params: { id: string }}) {
    await connectDB();

    const { id } = context.params;
    const { groupName, groupDescription, groupImage } = await req.json();
    const user = getAuthUser(req);

    if(!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const groupConversation = await Conversation.findById(id);
    if(!groupConversation || groupConversation.chatType !== "group") {
        return NextResponse.json({ error: "Group conversation not found." }, { status: 404 });
    }

    if(groupName) groupConversation.chatName = groupName;
    if(groupDescription) groupConversation.description = groupDescription;
    if(groupImage) {
        const imageUrl = await saveImage(groupImage, "groupImages");
        groupConversation.chatImage = imageUrl;
    }

    await groupConversation.save();

    return NextResponse.json({ user, conversation: groupConversation }, { status: 200 });
} 