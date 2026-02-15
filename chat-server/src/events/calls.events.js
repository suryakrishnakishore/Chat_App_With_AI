import { joinCallRoom } from "../controllers/calls.controller.js"

export default function callEvents(io, socket) {
    socket.on("call:join", (data) => {
        joinCallRoom(io, socket, data);
    });
}