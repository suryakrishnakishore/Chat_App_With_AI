import Message from "../models/Message.js";

export function handleSendMessage(io, socket, data) {
    const { chatId, participants, message } = data;
    io.to(chatId).emit("message:new", {
        chatId,
        message,
        senderId: socket.user.userId,
        timestamp: new Date().toISOString()
    });

    participants.forEach(userId => {
        io.to(userId.toString()).emit("message:notify", {
            chatId,
            message
        });
    });

}

export function handleDelivered(io, socket, data) {
    const { chatId, messageIds } = data;
    io.to(chatId).emit("message:delivered", {
        chatId,
        userId: socket.user.userId,
        messageIds
    });
}

export async function handleRead(io, socket, data) {
    const { chatId } = data;
    const userId = socket.user.userId;

    const unreadMessages = await Message.find({
        chatId,
        senderId: { $ne: userId },
        status: { $ne: "seen" }
    });

    if (unreadMessages.length === 0) return;

    const ids = unreadMessages.map(m => m._id);

    // Update DB
    await Message.updateMany(
        {
            _id: { $in: ids }
        },
        {
            $push: { readBy: userId },
            status: "seen"
        }
    );

    // Notify sender(s)
    io.to(chatId).emit("message:seen", {
        chatId,
        userId,
        messageIds: ids
    });
}

export function handleTyping(io, socket, data) {
    const { chatId, isTyping } = data;
    io.to(chatId).emit("message:type", {
        chatId,
        userId: socket.user.userId,
        isTyping
    });
}

