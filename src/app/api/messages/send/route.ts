import { getAuthUser } from "@/lib/auth";
import connectDB from "@/lib/database";
import { NextResponse } from "next/server";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";

export async function POST(req: Request) {
    await connectDB();

    const user = getAuthUser(req);
    console.log("Message send user: ", user);
    
    if(!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const {
        chatId,
        content,
        messageType,
        attachments,
        location,
        replyTo,
        forwarded
    } = await req.json();

    console.log("Message send req: ", {
        chatId,
        content,
        messageType,
        attachments,
        location,
        replyTo,
        forwarded
    });
    

    if(!chatId || !content || !messageType) {
        return NextResponse.json({ error: "Chat ID, content, and message type are required." }, { status: 400 });
    }

    const conversation = await Conversation.findById(chatId);
    console.log("Message send conversation: ", conversation);
    
    if(!conversation) {
        return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    }
    
    if(!conversation.participants.includes(user.id)) {
        return NextResponse.json({ error: "You are not a participant of this conversation." }, { status: 403 });
    }

    const newMessage = new Message({
        chatId,
        senderId: user.id,
        content,
        messageType,
        attachments,
        location,
        replyTo,
        forwarded
    });

    await newMessage.save();

    conversation.lastMessage = {
        messageId: newMessage._id,
        content: newMessage.content,
        messageType: newMessage.messageType,
        senderId: newMessage.senderId,
        timestamp: newMessage.createdAt
    };

    await conversation.save();

    return NextResponse.json({ message: newMessage }, { status: 201 });

    } catch (error: any) {
        console.log("Error sending message: ", error);
        
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}