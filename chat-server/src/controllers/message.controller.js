
export function handleSendMessage(io, socket, data) {
    const { chatId, message } = data;
    io.to(chatId).emit("message:new", {
        chatId,
        message,
        senderId: socket.user.userId,
        timestamp: new Date().toISOString()
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

export function handleRead(io, socket, data) {
    const { chatId, messageIds } = data;
    io.to(chatId).emit("message:readed", {
        chatId,
        userId: socket.user.userId,
        messageIds
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

