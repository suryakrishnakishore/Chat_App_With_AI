import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = (token: string) => {
  if (socket) return socket;
  console.log("WebSocket URL: ", "http://localhost:4000");
  
  socket = io("http://localhost:4000", {
    transports: ["websocket"],
    auth: { token },
    autoConnect: true,
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket?.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};


export function getSocket() {
    if(!socket) {
        console.error("Socket not Initialized.")
    }
    return socket;
}