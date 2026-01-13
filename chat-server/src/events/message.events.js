import { handleDelivered, handleRead, handleSendMessage, handleTyping } from "../controllers/message.controller.js"

export default function messageEvents(io, socket) {
    socket.on("message:send", (data) => {
        handleSendMessage(io, socket, data);
    });

    socket.on("message:deliver", (data) => {
        handleDelivered(io, socket, data);
    });

    socket.on("message:read", (data) => {
        handleRead(io, socket, data);
    });

    socket.on("message:typing", (data) => {
        handleTyping(io, socket, data);
    });
}