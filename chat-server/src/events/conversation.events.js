import { conversationGroupAddUser, conversationGroupPromoteAdmin, conversationGroupRemoveUser, conversationJoin, conversationLeave, conversationUpdate } from "../controllers/conversation.controller.js";


export default function conversationEvents(io, socket) {
    socket.on("conversation:join", (data) => {
        conversationJoin(io, socket, data);
    });

    socket.on("conversation:leave", (data) => {
        conversationLeave(io, socket, data);
    });

    socket.on("conversation:update", (data) => {
        conversationUpdate(io, socket, data);
    });

    socket.on("conversation:group:add-user", (data) => {
        conversationGroupAddUser(io, socket, data);
    });

    socket.on("conversation:group:remove-user", (data) => {
        conversationGroupRemoveUser(io, socket, data);
    });

    socket.on("conversation:group:promote-admin", (data) => {
        conversationGroupPromoteAdmin(io, socket, data);
    });
}