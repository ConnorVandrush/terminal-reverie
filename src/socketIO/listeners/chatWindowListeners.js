import { serverBroadcastChatMessage } from "@store/chatWindowSlice";

export function createChatWindowListeners(store)
{
    window.clientGlobalManager.clientPlayerManager.socket.on('serverBroadcastChatMessage', (data) =>
    {
        store.dispatch(serverBroadcastChatMessage(data));
    });
}