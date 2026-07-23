import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./PartyInvitesWindowComponent.module.css";
import { setCenterPanel } from "@store/ui/CenterPanelSlice.js";
import { clientSendPartyInvite } from "@store/party/PartySlice.js";

export default function PartyInvitesWindowComponent() {
  const dispatch = useDispatch();
  const characterToInviteToParty = useRef();
  function handleClientSendPartyInvite() {
    dispatch(clientSendPartyInvite(characterToInviteToParty.current.value));
  }
  return (
    <div className={styles.PartyInvitesWindowComponent}>
      <div className={styles.inputRow}>
        <input
          type="text"
          placeholder="Type name of player..."
          ref={characterToInviteToParty}
        />
        <button onClick={handleClientSendPartyInvite}>Invite</button>
        <button
          onClick={() => dispatch(setCenterPanel("PartyWindowComponent"))}
        >
          Party
        </button>
      </div>
      <div className={styles.statusMessage}></div>
      <div className={styles.invites}>Invites:</div>
    </div>
  );
}
