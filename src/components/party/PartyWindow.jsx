import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './PartyWindow.module.css';
import { clientSendPartyInvite, removePartyInvite, clientAcceptPartyInvite } from '@store/partyWindowSlice.js';

export default function PartyWindow() 
{
    const dispatch = useDispatch();

    const errorMessage = useSelector((state) => state.partyWindow.errorMessage);
    const successMessage = useSelector((state) => state.partyWindow.successMessage);
    const partyData = useSelector((state) => state.partyWindow.partyData);
    const partyInvites = useSelector((state) => state.partyWindow.partyInvites);
    const playerId = window.clientGlobalManager.clientPlayerManager.characterData.playerId;

    const invitedPlayerRef = useRef(null);

    function handleClientSendPartyInvite()
    {
        const invitedPlayer = invitedPlayerRef.current.value;
        dispatch(clientSendPartyInvite(invitedPlayer));
        invitedPlayerRef.current.value = '';
    }

    return (
        <div className={styles.partyWindow}>

            {(partyData.partyLeaderId === playerId || partyData.partyLeaderId === 0) && (
                <div className={styles.inputRow}>
                    <input type="text" placeholder="Invite to party..." ref={invitedPlayerRef}/>
                    <button onClick={handleClientSendPartyInvite}>Send</button>
                </div>
            )}

            {errorMessage && (
                <div className={styles.statusMessages}>
                    <div className={styles.errorMessage}>{errorMessage}</div>
                </div>
            )}

            {successMessage && (
                <div className={styles.statusMessages}>
                    <div className={styles.successMessage}>{successMessage}</div>
                </div>
            )}

            {partyInvites.length > 0 && !partyData.partyLeaderId && (
                <div className={styles.partyInvites}>
                    {partyInvites.map((invite, index) => (
                        <div key={index} className={styles.partyInvite}>
                            {invite.fromPlayerName} has invited you to their party!
                            <button onClick={() => dispatch(clientAcceptPartyInvite(invite.fromPlayerName))}>Accept</button>
                            <button onClick={() => dispatch(removePartyInvite(invite.fromPlayerName))}>Decline</button>
                        </div>
                    ))}
                </div>
            )}

            {partyData && partyData.members.length > 0 && (
                <div className={styles.partyMembers}>
                    {partyData.members.map((memberId) => (
                        <div key={memberId} className={styles.partyMember}>
                            {memberId}
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}