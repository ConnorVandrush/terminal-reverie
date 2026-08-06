import { serverBroadcastChatMessage } from "@store/chat/ChatSlice";

export default function ChatSliceListeners(store, action) {
  window.clientAPI.authNamespace.on("serverBroadcastChatMessage", (data) => {
    store.dispatch(serverBroadcastChatMessage(data));
  });
}
