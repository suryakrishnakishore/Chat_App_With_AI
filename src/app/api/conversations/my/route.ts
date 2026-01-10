import { getAuthUser } from "@/lib/auth";
import connectDB from "@/lib/database";
import Conversation from "@/models/Conversation";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    await connectDB();

    const user = getAuthUser(req);
    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized User." }), { status: 401 });
    }

    const userId = user.userId;

    try {
        const involvedConversations = await Conversation.find({
            participants: { $in: [userId] },
        }).sort({ updatedAt: -1 });

        return NextResponse.json({ conversations: involvedConversations }, { status: 200 });
    }
    catch (error: any) {
        console.error("Error while fetching user's conversations: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}