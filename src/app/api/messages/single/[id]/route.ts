import { NextResponse } from "next/server";
import connectDB from "@/lib/database";
import { getAuthUser } from "@/lib/auth";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    await connectDB();

    // 1️⃣ Authenticate user
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const messageId = context.params.id;
    if (!messageId) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      );
    }

    // 2️⃣ Fetch message
    const message = await Message.findById(messageId)
      .populate("senderId", "name profileImage")
      .lean();

    if (!message) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    // 3️⃣ Authorization: check conversation membership
    const conversation = await Conversation.findById(message.chatId).lean();

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const isParticipant = conversation.participants
      .some((id: any) => id.toString() === user.user_id);

    if (!isParticipant) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // 4️⃣ Return minimal payload
    return NextResponse.json(
      {
        message: {
          _id: message._id,
          chatId: message.chatId,
          sender: {
            _id: message.senderId._id,
            name: message.senderId.name,
            profileImage: message.senderId.profileImage,
          },
          messageType: message.messageType,
          content: message.content,
          attachments: message.attachments ?? null,
          location: message.location ?? null,
          replyTo: message.replyTo ?? null,
          forwarded: message.forwarded ?? false,
          timestamp: message.timestamp,
          status: message.status,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get single message error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
