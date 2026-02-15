const emailToSocketMap = new Map();

export function joinCallRoom(io, socket, data) {
    const { roomId } = data;
    console.log("Request to join call on roomId ", roomId);
    
    emailToSocketMap.set(socket.user.email, socket.id);
    socket.join(roomId);
    socket.emit("call:joined", { roomId });
    socket.broadcast.to(roomId).emit("call:user:joined", {
        roomId,
        userId: socket.user.userId,
        email: socket.user.email
    });
}