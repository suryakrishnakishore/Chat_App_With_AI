import { getAuthUser } from "@/lib/auth";
import connectDB from "@/lib/database";
import { saveImage } from "@/lib/saveImage";
import Conversation from "@/models/Conversation";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    await connectDB();
    const user = getAuthUser(req);
    if(!user){
        return NextResponse.json({ error: "Unauthorized User." }, { status: 401 });
    }

    const { groupName, groupImage, groupDescription, participantIds } = await req.json();
    if(!groupName || !participantIds || !Array.isArray(participantIds)) {
        return NextResponse.json({ error: "Group name and participant IDs are required for new group creation." }, { status: 400 });
    }
    let imageUrl = null;
    if(groupImage) {
        imageUrl = await saveImage(groupImage, "groupImages");
    }

    const newGroupConversation = new Conversation({
        participants: [user.userId, ...participantIds],
        chatType: "group",
        chatName: groupName,
        chatImage: imageUrl,
        description: groupDescription || "",
        admins: [user.userId],
        createdBy: user.userId,
    });

    await newGroupConversation.save();

    return NextResponse.json({ conversation: newGroupConversation }, { status: 201 });
}