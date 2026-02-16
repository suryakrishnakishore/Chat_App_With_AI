import { joinCallRoom } from "../controllers/calls.controller.js"

export default function callEvents(io, socket) {
    socket.on("call:join", (data) => {
        joinCallRoom(io, socket, data);
    });

    socket.on("call:offer", (data) => {
        handleCallOffer(io, socket, data);
    });

    socket.on("call:answer", (data) => {

    });

    socket.on("call:ice-candidate", (data) => {

    });

    socket.on("call:end", (data) => {

    });
}