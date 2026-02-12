import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { joinRoom, leaveRoom } from "../utils/socketRooms.js";

export async function conversationJoin(io, socket, data) {
    const { chatId } = data;
    joinRoom(socket, chatId);

    // const undelivered = await Message.find({
    //     chatId,
    //     senderId: { $ne: userId },
    //     deliveredTo: { $ne: userId }
    // }).select("_id");

    // const deliveredIds = undelivered.map(m => m._id);

    // await Message.updateMany(
    //     {
    //         _id: { $in: deliveredIds }
    //     },
    //     {
    //         status: "delivered"
    //     }
    // );

    io.to(chatId).emit("conversation:joined", {
        chatId,
        userId: socket.user.userId,
        email: socket.user.email
    });

    // io.to(chatId).emit("message:delivered", {
    //     chatId, userId: socket.user.userId, messageIds: deliveredIds
    // });
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

export async function conversationCreate(io, socket, data) {
    const { participantId } = data;
  try {
    const userId = socket.user.userId; 

    const existingConversation = await Conversation.findOne({
      participants: { $all: [userId, participantId] },
      chatType: "private"
    });

    if (existingConversation) {
      socket.emit("conversation:created", existingConversation);
      return;
    }

    const newConversation = await Conversation.create({
      participants: [userId, participantId],
      chatType: "private",
    });

    socket.emit("conversation:created", newConversation);

    io.to(participantId.toString()).emit(
      "conversation:new",
      newConversation
    );

  } catch (error) {
    console.error("Conversation creation error:", error);
  }
}
