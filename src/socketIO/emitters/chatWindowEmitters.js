import { clientSendChatMessage } from "@store/chatWindowSlice.js";

export default async function chatWindowEmitters(action) {
  const socket = window.clientGlobalManager.clientPlayerManager.socket;

  if (action.type === clientSendChatMessage.type) {
    socket.emit("clientSendChatMessage", action.payload);
  }
}
