import callEvents from "./calls.events.js";
import conversationEvents from "./conversation.events.js";
import messageEvents from "./message.events.js";

export default function registerEvents(io, socket) {
    conversationEvents(io, socket);
    messageEvents(io, socket);
    callEvents(io, socket);
}