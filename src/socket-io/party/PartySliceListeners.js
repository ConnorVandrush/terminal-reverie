import {
  serverDeliverPartyInvite,
  setPartyMembers,
} from "@store/party/PartySlice";

export default function PartySliceListeners(store) {
  window.clientAPI.authNamespace.on("serverDeliverPartyInvite", (data) => {
    store.dispatch(serverDeliverPartyInvite(data));
  });
  window.clientAPI.authNamespace.on("serverSyncPartyData", (partyMembers) => {
    store.dispatch(setPartyMembers(partyMembers));
  });
}
