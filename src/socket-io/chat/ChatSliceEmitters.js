import { clientSendChatMessage } from "@store/chat/ChatSlice.js";

export default async function ChatSliceEmitters(store, action) {
  console.log("Action:", action);
  console.log("Action type:", action.type);
  console.log("Expected:", clientSendChatMessage.type);
  if (action.type === clientSendChatMessage.type) {
    console.log("Emitting chat:", action.payload);
    window.clientAPI.authNamespace.emit(
      "clientSendChatMessage",
      action.payload,
    );
  }
}
