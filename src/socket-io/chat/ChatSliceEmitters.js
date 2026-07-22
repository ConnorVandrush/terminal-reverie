import { clientSendChatMessage } from "@store/chat/ChatSlice.js";

export default async function ChatSliceEmitters(store, action) {
  if (action.type === clientSendChatMessage.type) {
    window.clientAPI.authNamespace.emit(
      "clientSendChatMessage",
      action.payload,
    );
  }
}
