import conversationEvents from "./conversation.events";
import messageEvents from "./message.events";

export default function registerEvents(io, socket) {
    conversationEvents(io, socket);
    messageEvents(io, socket);
}