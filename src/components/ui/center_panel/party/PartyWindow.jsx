import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { 
    setSelectedPartyMember, 
    clientSendPartyInvite, 
    removePartyInvite, 
    clientAcceptPartyInvite, 
    clientLeaveParty, 
    clientKickPartyMember 
} from '@store/partyWindowSlice.js';

import { setCenterPanel } from '@store/centerPanelSlice.js';

import styles from './PartyWindow.module.css';

export default function PartyWindow() 
{
    const dispatch = useDispatch();

    const partyData = useSelector(state => state.partyWindow.partyData);
    const selectedPartyMember = useSelector(state => state.partyWindow.selectedPartyMember);

    // Safe selector for characterData
    const characterData = useSelector(state => {
        const data = state.partyWindow.partyData;
        if (!data || !data.members) return null;

        const playerId = window.clientGlobalManager.clientPlayerManager.characterData.playerId;
        return data.members.find(m => m.playerId === playerId) || null;
    });

    const members = partyData?.members || [null, null, null, null];

    return (
        <div className={styles.partyWindow}>
            
            <div className={styles.partyMembers}>
                {[0, 1, 2, 3].map(slotIndex => {
                    const member = members[slotIndex];
                    const isSelected = selectedPartyMember === slotIndex;

                    return (
                        <button
                            key={slotIndex}
                            disabled={!member}
                            className={`${styles.partyMemberButton} ${
                                isSelected ? styles.selectedPartyMember : ""
                            }`}
                            onClick={() => {
                                if (!member) return;

                                dispatch(
                                    setSelectedPartyMember(
                                        isSelected ? null : slotIndex
                                    )
                                );
                            }}
                        >
                            <div className={styles.partyMemberHeader}>
                                <div className={styles.partyMemberName}>
                                    {member ? member.name : ""}
                                </div>

                                <div className={styles.partyMemberLevel}>
                                    {member ? `Lv ${member.level}` : ""}
                                </div>
                            </div>

                            {member && (
                                <div className={styles.partyMemberStatus}>
                                    HP: {member.currentHp}/{member.maxHp}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className={styles.buttonContainer}>
                <button 
                    disabled={partyData.members.length == 4 || 
                    partyData.members[0].playerId !== characterData?.playerId && partyData.members.length > 1} 
                    onClick={() => dispatch(setCenterPanel('partyInvites'))}
                >
                    Join/Invite
                </button>

                <button
                    disabled={partyData.members.length == 1}
                    onClick={() => dispatch(clientLeaveParty(partyData.members[0].playerId))}
                >
                    Leave
                </button>

                <button
                    disabled={
                        partyData.members[0].playerId !== characterData?.playerId || !members[selectedPartyMember] || selectedPartyMember === 0
                    }
                    onClick={() => {
                        const member = members[selectedPartyMember];
                        dispatch(clientKickPartyMember(member.playerId));
                    }}
                >
                    Kick
                </button>
            </div>
        </div>
    );
}
