import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './PartyWindow.module.css';
import { clientSendPartyInvite, removePartyInvite, clientAcceptPartyInvite, clientLeaveParty } from '@store/partyWindowSlice.js';

export default function PartyWindow() 
{
    const dispatch = useDispatch();

    const errorMessage = useSelector((state) => state.partyWindow.errorMessage);
    const successMessage = useSelector((state) => state.partyWindow.successMessage);
    const partyData = useSelector((state) => state.partyWindow.partyData);
    const partyInvites = useSelector((state) => state.partyWindow.partyInvites);
    const selectedItem = useSelector((state) => state.inventory.selectedItem)
    const selectedPartyMember = useSelector((state) => state.partyWindow.selectedPartyMember);
    const characterData = window.clientGlobalManager.clientPlayerManager.characterData
    const playerId = characterData.playerId;

    const invitedPlayerRef = useRef(null);

    function handleClientSendPartyInvite()
    {
        const invitedPlayer = invitedPlayerRef.current.value;
        dispatch(clientSendPartyInvite(invitedPlayer));
        invitedPlayerRef.current.value = '';
    }

    return (
        <div className={styles.partyWindow}>

            {(partyData === null || partyData.members[0].playerId === playerId) && (
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

            {partyInvites.length > 0 && partyData === null && (
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

            {partyData && partyData.members && (
                <>
                    <div className={styles.partyMembers}>
                        {partyData.members.map((member, index) => (
                            <div
                                key={index}
                                className={`${styles.partyMember} ${
                                    index === selectedPartyMember ? styles.selectedPartyMember : ""
                                }`}
                            >
                                <div className={styles.memberName}>{member.name}</div>
                                <div className={styles.memberLevel}>Level {member.level}</div>
                                <div className={styles.memberHp}>
                                    HP: {member.currentHp}/{member.maxHp}
                                </div>

                                {partyData.members[0].playerId === playerId &&
                                    member.playerId !== playerId && (
                                        <div className={styles.kickPartyMemberButtonContainer}>
                                            <button onClick={() => dispatch(clientKickPartyMember(member.playerId))}>
                                                Kick
                                            </button>
                                        </div>
                                    )}
                            </div>
                        ))}
                    </div>

                    {partyData.members.length > 1 && (
                    <div className={styles.leavePartyButtonContainer}>
                        <button onClick={() => dispatch(clientLeaveParty(partyData.members[0].playerId))}>Leave Party</button>
                    </div>
                    )}

                    {selectedItem && (
                        <div className={styles.itemDescription}>
                            {selectedItem.item.description}
                        </div>
                    )}
                </>
            )}

        </div>
    );
}