import conversationEvents from "./conversation.events";

export default function registerEvents(io, socket) {
    conversationEvents(io, socket);
}