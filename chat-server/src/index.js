import { Server } from "socket.io";
import http from "http";
import app from "./app.js";
import env from "dotenv";
// import redis from "./config/redis.js";
import { JWT_SECRET, PORT } from "./env.js";
import jwt from "jsonwebtoken";
import registerEvents from "./events/index.js";
import connectDB from "./libs/database.js";
import Message from "./models/Message.js";
import mongoose from "mongoose";

connectDB();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// redis.on("ready", () => {
//     console.log("Redis is connected to socket server.");
// });

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
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

const onlineUsers = new Map();

io.on("connection", async (socket) => {
    console.log("User connected on socket server with ID: ", socket.id);
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });
    
    registerEvents(io, socket);
    socket.on("user:online", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log("User online ID", userId);

        io.emit("presence:update", {
            userId: userId.toString(),
            isOnline: true
        });

        socket.emit("presence:list", Object.fromEntries(onlineUsers));
    });

    try {
        console.log("Delivered user id: ", socket.user.userId);
        
        const undelivered = await Message.find({
            senderId: { $ne: new mongoose.Types.ObjectId(socket.user.userId) },
            status: "sent"
        }).select("_id chatId");
        console.log("Undelivered messages: ", undelivered);

        const ids = undelivered.map(m => m._id);

        if (ids.legnth > 0) {
            await Message.updateMany(
                { _id: { $in: ids } },
                {
                    status: "delivered"
                }
            );

            const chatIds = [...new Set(undelivered.map(m => m.chatId.toString()))];

            chatIds.forEach(chatId => {
                io.to(chatId).emit("message:delivered", {
                    chatId,
                    userId,
                    messageIds: ids
                });
            });
        }
    } catch (err) {
        console.log("Error while setting delivered status.", err);

    }


    socket.on("disconnect", () => {
        console.log("User with ID ", socket.id, " disconnected from socket server.");
        const entry = [...onlineUsers.entries()].find(([key, val]) => val === socket.id);

        if (!entry) {
            console.log("No user found for this socket. Ignoring disconnect.");
            return;
        }

        const userId = entry[0];

        onlineUsers.delete(userId);

        io.emit("presence:update", { userId: userId.toString(), isOnline: false });

        console.log("User offline:", userId);
    });
});

server.listen(PORT, () => {
    console.log("Socket server is running on port: ", PORT);
});

export default io;