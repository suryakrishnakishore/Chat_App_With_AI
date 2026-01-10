import { getAuthUser } from "@/lib/auth";
import connectDB from "@/lib/database";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, context: { params: { chatId: string } }) {
    await connectDB();

    const { chatId } = context.params;
    const { messageIds } = await req.json();

    if (!chatId || !messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
        return NextResponse.json({ error: "Chat ID and Message IDs are required." }, { status: 400 });
    }

    const user = await getAuthUser(req);

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const conversation = await Conversation.findById(chatId);

        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
        }

        const isParticipant = conversation.participants
            .some((id: any) => id.toString() === user.user_id);

        if (!isParticipant) {
            return NextResponse.json(
                { error: "You are not a participant of this conversation." },
                { status: 403 }
            );
        }

        const isAdmin =
            conversation.chatType === "group" &&
            conversation.admins?.some((id: any) => id.toString() === user.user_id);

        if (conversation.chatType === "group" && isAdmin) {
            const message = await Message.updateMany({
                _id: { $in: messageIds },
                chatId,
                status: { $ne: "deleted" }
            }, {
                $set: { status: "deleted", attachments: null, location: null, content: "This message has been deleted by an admin." }
            });
            return NextResponse.json({ modifiedCount: message.modifiedCount }, { status: 200 });
        }
        if (conversation.chatType === "group" && !isAdmin) {
            const messages = await Message.updateMany(
                {
                    _id: { $in: messageIds },
                    chatId,
                    senderId: user.user_id,
                    status: { $ne: "deleted" }
                },
                {
                    $set: { status: "deleted", attachments: null, location: null, content: "This message has been deleted." }
                }
            );
            return NextResponse.json({ modifiedCount: messages.modifiedCount }, { status: 200 });
        }
        const messages = await Message.updateMany(
            {
                _id: { $in: messageIds },
                chatId,
                senderId: user.user_id,
                status: { $ne: "deleted" }
            },
            {
                $set: { status: "deleted", attachments: null, location: null, content: "This message has been deleted." }
            }
        );

        return NextResponse.json({ modifiedCount: messages.modifiedCount }, { status: 200 });
    } catch (error: any) {
        console.log("Error deleting message: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}