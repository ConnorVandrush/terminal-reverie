import { serverSendPartyInvite } from "@store/partyWindowSlice";

export function createPartyWindowListeners(store) {
  window.clientGlobalManager.clientPlayerManager.socket.on(
    "serverSendPartyInvite",
    (data) => {
      store.dispatch(serverSendPartyInvite(data));
    },
  );
}
