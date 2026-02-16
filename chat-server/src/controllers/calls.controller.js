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

export function handleCallOffer(io, socket, { to, callType, offer }) {
    io.to(to).emit("incoming:call", {
        from: socket.user.userId,
        callType,
        offer
    });
}

export function handleCallAnswer(io, socket, { to, answer }) {
    io.to(to).emit("call:answer", {
        answer
    });
}

export function handleICECandidate(io, socket, { to, candidate }) {
    io.to(to).emit("call:ice-candidate", {
        candidate
    });
}

export function handleCallEnd(io, socket, { to }) {
    io.to(to).emit("call:end");
}