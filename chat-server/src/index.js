import { Server } from "socket.io";
import http from "http";
import app from "./app.js";
import env from "dotenv";
import redis from "./config/redis.js";
import { JWT_SECRET, PORT } from "./env.js";
import jwt from "jsonwebtoken";

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

redis.on("ready", () => {
    console.log("Redis is connected to socket server.");
});

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if(!token) {
        return next(new Error("Authentication error: Token not provided."));
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        socket.user = {
            userId: decoded.id,
            email: decoded.email,
        }
        return next();
    } catch (err) {
        return next(new Error("Authentication error: Invalid token."));
    }
});



io.on("connection", (socket) => {
    console.log("User connected on socket server with ID: ", socket.id);
    
    socket.on("disconnect", () => {
        console.log("User with ID ", socket.id, " disconnected from socket server.");
    });
});

server.listen(PORT, () => {
    console.log("Socket server is running on port: ", PORT); 
});

export default io;