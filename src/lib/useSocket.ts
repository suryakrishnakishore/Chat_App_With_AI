import { useMessageStore } from "@/store/message-store";
import { getSocket } from "./socket";
import { usePresenceStore } from "@/store/presence-store";

export function registerMessageEvents() {
    const socket = getSocket();
    if (!socket) return;
    const addMessage = useMessageStore.getState().addMessage;

    socket.on("message:new", ({ chatId, message }) => {
        addMessage(chatId, message);
    });
}

export function registerPresenceEvents() {
    const socket = getSocket();
    if (!socket) return;

    const { setOnline, setOffline, setPresenceList } = usePresenceStore.getState();

    socket.on("presence:update", ({ userId, isOnline }) => {
        if (isOnline) setOnline(userId);
        else setOffline(userId);
    });

    socket.on("presence:list", (list) => {
        setPresenceList(list);
    });
}