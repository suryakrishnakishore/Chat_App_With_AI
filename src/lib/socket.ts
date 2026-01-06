import { io, Socket } from "socket.io-client";

let socket : Socket | null = null;

export function initSocket(token: string) {
    if(!socket) {
        socket = io(process.env.WEBSOCKET_SERVER_URL, {
            auth: { token },
            transports: ["websocket"],
        });
    }

    return socket;
}

export function getSocket() {
    if(!socket) {
        throw new Error("Socket not initialized");
    }
    return socket;
}