import { Server } from "socket.io";
import http from "http";
import app from "./app.js";
import env from "dotenv";
import redis from "./config/redis.js";

env.config();

const server = http.createServer(app);
const io = new Server(server);

redis.on("ready", () => {
    console.log("Redis is connected to socket server.");
});

io.on("connection", (socket) => {
    console.log("User connected on socket server with ID: ", socket.id);
    
    socket.on("disconnect", () => {
        console.log("User with ID ", socket.id, " disconnected from socket server.");
    });
});

server.listen(process.env.PORT, () => {
    console.log("Socket server is running on port: ", process.env.PORT); 
});