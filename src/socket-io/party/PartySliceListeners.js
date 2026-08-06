import {
  serverDeliverPartyInvite,
  setMember1CharacterData,
  setMember2CharacterData,
  setMember3CharacterData,
  setMember4CharacterData,
} from "@store/party/PartySlice";

import { setCenterPanel } from "@store/ui/CenterPanelSlice";

export default function PartySliceListeners(store, action) {
  window.clientAPI.authNamespace.on("serverDeliverPartyInvite", (data) => {
    store.dispatch(serverDeliverPartyInvite(data));
  });

  window.clientAPI.authNamespace.on(
    "characterJoinedOrLeftParty",
    ({ member1, member2, member3, member4 }) => {
      store.dispatch(setMember1CharacterData(member1));
      store.dispatch(setMember2CharacterData(member2));
      store.dispatch(setMember3CharacterData(member3));
      store.dispatch(setMember4CharacterData(member4));
    },
  );
}
