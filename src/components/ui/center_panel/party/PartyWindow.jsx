import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setSelectedPartyMember,
  clientSendPartyInvite,
  removePartyInvite,
  clientAcceptPartyInvite,
  clientLeaveParty,
  clientKickPartyMember,
} from "@store/partyWindowSlice.js";

import { setCenterPanel } from "@store/centerPanelSlice.js";

import styles from "./PartyWindow.module.css";

export default function PartyWindow() {
  const dispatch = useDispatch();

  const partyData = useSelector((state) => state.partyWindow.partyData);

  const selectedPartyMember = useSelector(
    (state) => state.partyWindow.selectedPartyMember,
  );

  const characterData = useSelector((state) => {
    const data = state.partyWindow.partyData;

    if (!data?.members?.length) {
      return null;
    }

    const playerId =
      window.clientGlobalManager?.clientPlayerManager?.characterData?.playerId;

    return data.members.find((member) => member?.playerId === playerId) || null;
  });

  // Safe members array
  const partyMembers = partyData?.members || [];

  // Safe leader reference
  const leader = partyMembers[0] || null;

  // Ensure exactly 4 UI slots
  const members = [...partyMembers].filter(Boolean).slice(0, 4);

  while (members.length < 4) {
    members.push(null);
  }

  const isLeader = leader?.playerId === characterData?.playerId;

  const selectedMember =
    selectedPartyMember != null ? members[selectedPartyMember] : null;

  const canInvite =
    leader &&
    partyMembers.length < 4 &&
    (isLeader || partyMembers.length === 1);

  const canLeave = leader && partyMembers.length > 1;

  const canKick =
    leader && isLeader && selectedMember && selectedPartyMember !== 0;

  const handleSelectMember = (slotIndex, member) => {
    if (!member) return;

    dispatch(
      setSelectedPartyMember(
        selectedPartyMember === slotIndex ? null : slotIndex,
      ),
    );
  };

  const handleLeave = () => {
    if (!leader) return;

    dispatch(clientLeaveParty(leader.playerId));
  };

  const handleKick = () => {
    if (!leader || !selectedMember) return;

    dispatch(
      clientKickPartyMember({
        partyLeaderId: leader.playerId,
        memberPlayerId: selectedMember.playerId,
      }),
    );
  };

  return (
    <div className={styles.partyWindow}>
      <div className={styles.partyMembers}>
        {[0, 1, 2, 3].map((slotIndex) => {
          const member = members[slotIndex];
          const isSelected = selectedPartyMember === slotIndex;

          return (
            <button
              key={slotIndex}
              disabled={!member}
              className={`
                                ${styles.partyMemberButton}
                                ${isSelected ? styles.selectedPartyMember : ""}
                            `}
              onClick={() => handleSelectMember(slotIndex, member)}
            >
              <div className={styles.partyMemberHeader}>
                <div className={styles.partyMemberName}>
                  {member?.name || ""}
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
          disabled={!canInvite}
          onClick={() => dispatch(setCenterPanel("partyInvites"))}
        >
          Join/Invite
        </button>

        <button disabled={!canLeave} onClick={handleLeave}>
          Leave
        </button>

        <button disabled={!canKick} onClick={handleKick}>
          Kick
        </button>
      </div>
    </div>
  );
}
