export function joinRoom(socket, chatId) {
  socket.join(chatId);
}

export function leaveRoom(socket, chatId) {
  socket.leave(chatId);
}
