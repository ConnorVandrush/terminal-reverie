import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./PartyInvitesWindowComponent.module.css";
import { setCenterPanel } from "@store/ui/CenterPanelSlice.js";
import { clientSendPartyInvite } from "@store/party/PartySlice.js";
import {
  removePartyInvite,
  setErrorMessage,
  clientAcceptPartyInvite,
} from "@store/party/PartySlice";

export default function PartyInvitesWindowComponent() {
  const dispatch = useDispatch();
  const successMessage = useSelector(
    (state) => state.PartySlice.successMessage,
  );
  const errorMessage = useSelector((state) => state.PartySlice.errorMessage);
  const partyInvites = useSelector((state) => state.PartySlice.partyInvites);
  const characterToInviteToParty = useRef();

  function handleClientSendPartyInvite() {
    dispatch(clientSendPartyInvite(characterToInviteToParty.current.value));
    characterToInviteToParty.current.value = "";
  }

  function handleClientAcceptPartyInvite(senderId) {
    dispatch(clientAcceptPartyInvite(senderId));
    dispatch(removePartyInvite(senderId));
  }

  useEffect(() => {
    dispatch(setErrorMessage(""));
  }, []);

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
      <div className={styles.statusMessage}>
        {errorMessage && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}
        {successMessage && (
          <div className={styles.successMessage}>{successMessage}</div>
        )}
      </div>
      <div className={styles.invites}>
        Invites:
        {partyInvites && Object.entries(partyInvites).length > 0 ? (
          Object.entries(partyInvites).map(([senderId, senderName]) => (
            <div key={senderId} className={styles.inviteRow}>
              {senderName} has invited you.
              <button
                onClick={() => handleClientAcceptPartyInvite(Number(senderId))}
              >
                Accept
              </button>
              <button onClick={() => dispatch(removePartyInvite(senderId))}>
                Decline
              </button>
            </div>
          ))
        ) : (
          <div>No invites</div>
        )}
      </div>
    </div>
  );
}
