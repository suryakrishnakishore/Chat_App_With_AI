import { getAuthUser } from "@/lib/auth";
import connectDB from "@/lib/database";
import Message from "@/models/Message";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    await connectDB();

    try {
        const { chatId, messageIds } = await req.json();
        
        if(!chatId || !messageIds || !Array.isArray(messageIds)) {
            return NextResponse.json({ error: "Chat ID and message IDs are required." }, { status: 400 });
        }

        const user = getAuthUser(req);

        if(!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const messages = await Message.updateMany(
            {
                _id: { $in: messageIds },
                chatId,
                deliveredTo: { $ne: user.user_id }
            },
            {
                $addToSet: { deliveredTo: user.user_id },
                $set: { status: "delivered" }
            }
        );

        return NextResponse.json({ modifiedCount: messages.modifiedCount }, { status: 200 });
    } catch (error: any) {
        console.log("Error marking messages as delivered: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}