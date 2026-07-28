import { serverDeliverPartyInvite } from "@store/party/PartySlice";

export function PartySliceListeners(store, action) {
  window.clientAPI.authNamespace.on("serverDeliverPartyInvite", (data) => {
    console.log("recieved");
    store.dispatch(serverDeliverPartyInvite(data));
  });
}
