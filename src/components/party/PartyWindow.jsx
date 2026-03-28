import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './PartyWindow.module.css';
import { clientSendPartyInvite } from '@store/partyWindowSlice.js';

export default function PartyWindow() 
{
    const dispatch = useDispatch();

    const invitedPlayerRef = useRef(null);

    function handleClientSendPartyInvite()
    {
        const invitedPlayer = invitedPlayerRef.current.value;
        dispatch(clientSendPartyInvite(invitedPlayer));
        invitedPlayerRef.current.value = '';
    }

    return (
        <div className={styles.partyWindow}>
            <div className={styles.partyMembers}>
            </div>
            <div className={styles.inputRow}>
                <input type="text" placeholder="Invite to party..." ref={invitedPlayerRef}/>
                <button onClick={handleClientSendPartyInvite}>Send</button>
            </div>
        </div>
    );
}