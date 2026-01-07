import { joinRoom, leaveRoom } from "../utils/socketRooms";

export function conversationJoin(io, socket,data) {
    const { chatId } = data;
    joinRoom(socket, chatId);
    
    io.to(chatId).emit("conversation:joined", {
        chatId,
        userId: socket.user.userId,
        email: socket.user.email
    });


}

export function conversationLeave(io, socket, data) {
    const { chatId } = data;
    leaveRoom(socket, chatId);

    io.to(chatId).emit("conversation:leave", {
        chatId, 
        userId: socket.user.userId,
        email: socket.user.email
    });


}

export function conversationUpdate(io, socket, data) {
    const { chatId, updates } = data;

    io.to(chatId).emit("conversation:update", {
        chatId,
        userId: socket.user.userId,
        email: socket.user.email,
        updates
    });
}

export function conversationGroupAddUser(io, socket, data) {
    const { chatId, memberId } = data;

    io.to(chatId).emit("conversation:group:add-user", {
        chatId,
        userId: socket.user.userId,
        email: socket.user.email,
        memberId
    });
}

export function conversationGroupRemoveUser(io, socket, data) {
    const { chatId, memberId } = data;

    io.to(chatId).emit("conversation:group:remove-user", {
        chatId,
        userId: socket.user.userId,
        email: socket.user.email,
        memberId
    });
}

export function conversationGroupPromoteAdmin(io, socket, data) {
    const { chatId, promoteId } = data;

    io.to(chatId).emit("conversation:group:promote-admin", {
        chatId,
        userId: socket.user.userId,
        email: socket.user.email,
        promoteId
    });
}