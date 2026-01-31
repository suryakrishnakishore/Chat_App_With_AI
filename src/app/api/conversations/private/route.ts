import { getAuthUser } from "@/lib/auth";
import connectDB from "@/lib/database";
import Conversation from "@/models/Conversation";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    await connectDB();
    const user = getAuthUser(req);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized User." }, { status: 401 });
    }
    const userId = user.id;
    const { participantId } = await req.json();
    if (!userId || !participantId) {
        return NextResponse.json({ error: "UserID and ParticipantID are required." }, { status: 400 });
    }
    try {
        const existingConversation = await Conversation.findOne({
            participants: { $all: [userId, participantId] },
            chatType: "private"
        });

        if (existingConversation) {
            return NextResponse.json({ conversation: existingConversation }, { status: 200 });
        }

        const newConversation = await Conversation.create({
            participants: [userId, participantId],
            chatType: "private",
        });

        return NextResponse.json({ conversation: newConversation }, { status: 201 });
    }
    catch (error: any) {
        console.error("Error while fetching/creating private conversation: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}