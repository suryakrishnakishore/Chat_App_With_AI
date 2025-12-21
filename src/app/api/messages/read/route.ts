import { getAuthUser } from "@/lib/auth";
import connectDB from "@/lib/database";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    await connectDB();

    const user = getAuthUser(req);

    if(!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        const { chatId, messageIds } = await req.json();

        if(!chatId || !messageIds || !Array.isArray(messageIds)) {
            return NextResponse.json({ error: "Chat ID and message IDs are required." }, { status: 400 });
        }

        const messages = await Message.updateMany(
            {
                _id: { $in: messageIds },
                chatId,
                readBy: { $ne: user.user_id }
            },
            {
                $addToSet: { readBy: user.user_id },
                $set: { status: "read" }
            }
        );

        await Conversation.updateOne({
            _id: chatId
        }, {
            $set: {
                updatedAt: new Date()
            }
        });

        return NextResponse.json({
            modifiedCount: messages.modifiedCount
        }, {
            status: 200
        })

    } catch (error: any) {
        console.log("Error marking messages as read: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}