import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    clientAcceptPartyInvite, 
    removePartyInvite, 
    clientSendPartyInvite 
} from '@store/partyWindowSlice.js';
import { setCenterPanel } from '@store/centerPanelSlice.js';

import styles from './PartyInvites.module.css';

export default function PartyInvites() 
{
    const dispatch = useDispatch();

    // Safe selectors — these will never crash
    const partyInvites = useSelector(state => state.partyWindow.partyInvites || []);
    const errorMessage = useSelector(state => state.partyWindow.errorMessage || null);
    const successMessage = useSelector(state => state.partyWindow.successMessage || null);

    const invitedPlayerRef = useRef(null);

    const handleClientSendPartyInvite = () => 
    {
        const invitedPlayer = invitedPlayerRef.current?.value?.trim();
        if (!invitedPlayer) return;

        dispatch(clientSendPartyInvite(invitedPlayer));
        invitedPlayerRef.current.value = '';
    };

    const handleAcceptInvite = (fromPlayerName) => 
    {
        if (!fromPlayerName) return;

        dispatch(clientAcceptPartyInvite(fromPlayerName));
        dispatch(removePartyInvite(fromPlayerName));
    };

    return (
        <div className={styles.partyInvites}>

            {/* Input Row */}
            <div className={styles.inputRow}>
                <input 
                    type="text" 
                    placeholder="Enter player name to invite" 
                    ref={invitedPlayerRef} 
                    className={styles.inviteInput} 
                />

                <button 
                    className={styles.sendInviteButton} 
                    onClick={handleClientSendPartyInvite}
                >
                    Send Invite
                </button>

                <button 
                    className={styles.backButton} 
                    onClick={() => dispatch(setCenterPanel('partyWindow'))}
                >
                    Back
                </button>
            </div>

            {/* Messages */}
            <div className={styles.message}>
                {errorMessage && (
                    <div className={styles.inviteMessage}>
                        <div className={styles.errorMessage}>{errorMessage}</div>
                    </div>
                )}

                {successMessage && (
                    <div className={styles.inviteMessage}>
                        <div className={styles.successMessage}>{successMessage}</div>
                    </div>
                )}
            </div>

            {/* Invite List */}
            <div className={styles.invitesList}>
                <h3 className={styles.invitesTitle}>Party Invites</h3>

                {partyInvites.length > 0 ? (
                    partyInvites.map(invite => (
                        <div 
                            key={invite.fromPlayerName} 
                            className={styles.invite}
                        >
                            <span className={styles.inviteText}>
                                {invite.fromPlayerName} has invited you to join their party.
                            </span>

                            <button 
                                className={styles.acceptButton}
                                onClick={() => handleAcceptInvite(invite.fromPlayerName)}
                            >
                                Accept
                            </button>

                            <button 
                                className={styles.declineButton}
                                onClick={() => dispatch(removePartyInvite(invite.fromPlayerName))}
                            >
                                Decline
                            </button>
                        </div>
                    ))
                ) : (
                    <div className={styles.noInvites}>No party invites</div>
                )}
            </div>

            {/* Empty footer container (kept for layout consistency) */}
            <div className={styles.buttonContainer}></div>

        </div>
    );
}
