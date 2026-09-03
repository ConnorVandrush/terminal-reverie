import {
  serverDeliverPartyInvite,
  setPartyMembers,
} from "@store/party/PartySlice";

export default function PartySliceListeners(store) {
  window.clientAPI.authNamespace.on("serverDeliverPartyInvite", (data) => {
    store.dispatch(serverDeliverPartyInvite(data));
  });

  window.clientAPI.authNamespace.on("serverSyncPartyData", (partyMembers) => {
    console.log(
      "SYNC:",
      partyMembers.map((member) => member?.characterId),
    );
    console.log("PLAYER:", window.clientAPI.playerManager.playerCharacterId);

    store.dispatch(setPartyMembers(partyMembers));
  });
}
