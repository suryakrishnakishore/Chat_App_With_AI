import { useMessageStore } from "@/store/message-store";
import { getSocket } from "./socket";

export function registerMessageEvents() {
    const socket = getSocket();

    const addMessage = useMessageStore.getState().addMessage;

    socket.on("message:new", ({ chatId, message }) => {
        addMessage(chatId, message);
    });
}