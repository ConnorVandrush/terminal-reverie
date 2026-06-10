import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setSelectedPartyMember,
  setSelectedEquipmentSlot,
  setIsOwnEquipmentSlot,
  clientLeaveParty,
  clientKickPartyMember,
} from "@store/partyWindowSlice.js";

import { setCenterPanel } from "@store/centerPanelSlice.js";

import styles from "./PartyWindow.module.css";

export default function PartyWindow() {
  const dispatch = useDispatch();

  // --- Redux State ---
  const equipment2 = useSelector((state) => state.partyWindow.equipment);
  const partyData = useSelector((state) => state.partyWindow.partyData);
  const equipment = useSelector((state) => state.partyWindow.equipment); // 🔥 unified equipment array
  const selectedPartyMember = useSelector(
    (state) => state.partyWindow.selectedPartyMember,
  );
  const selectedEquipmentSlot = useSelector(
    (state) => state.partyWindow.selectedEquipmentSlot,
  );
  const selectedItem = useSelector((state) => state.inventory.selectedItem);

  // --- Player Character ---
  const characterData = useSelector((state) => {
    const data = state.partyWindow.partyData;
    if (!data?.members?.length) return null;

    const playerId =
      window.clientGlobalManager?.clientPlayerManager?.characterData?.playerId;

    return data.members.find((m) => m?.playerId === playerId) || null;
  });

  // --- Party Members ---
  const partyMembers = partyData?.members || [];
  const members = [...partyMembers].filter(Boolean).slice(0, 4);
  while (members.length < 4) members.push(null);

  const leader = members[0];
  const isLeader = leader?.playerId === characterData?.playerId;

  const selectedMember =
    selectedPartyMember != null ? members[selectedPartyMember] : null;

  const realMemberCount = partyMembers.filter(Boolean).length;

  const canInvite =
    leader && realMemberCount < 4 && (isLeader || realMemberCount === 1);

  const canLeave = leader && members.length > 1;

  const canKick =
    leader && isLeader && selectedMember && selectedPartyMember !== 0;

  // --- Handlers ---
  const handleSelectMember = (slotIndex, member) => {
    if (!member) return;

    dispatch(setSelectedEquipmentSlot(null));
    dispatch(
      setSelectedPartyMember(
        selectedPartyMember === slotIndex ? null : slotIndex,
      ),
    );
  };

  const handleSelectEquipmentSlot = (slot, member, slotIndex) => {
    if (!member) return;

    dispatch(setSelectedPartyMember(null));

    const isOwn = member.playerId === characterData.playerId;
    dispatch(setIsOwnEquipmentSlot(isOwn));

    dispatch(
      setSelectedEquipmentSlot(
        selectedEquipmentSlot === `${slot}${slotIndex}`
          ? null
          : `${slot}${slotIndex}`,
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

  // --- Render ---
  return (
    <div className={styles.partyWindow}>
      <div className={styles.partyMembers}>
        {[0, 1, 2, 3].map((slotIndex) => {
          const member = members[slotIndex];
          const isSelected = selectedPartyMember === slotIndex;

          const equip = equipment[slotIndex]; // 🔥 Redux equipment for this member

          return (
            <div key={slotIndex} className={styles.partyMemberDiv}>
              {/* --- Member Header --- */}
              <button
                disabled={!member}
                className={`${styles.partyMemberHeaderButton} ${
                  isSelected ? styles.selectedPartyMember : ""
                }`}
                onClick={() => handleSelectMember(slotIndex, member)}
              >
                <div className={styles.partyMemberHeader}>
                  <div className={styles.partyMemberName}>
                    {member?.name || ""}
                  </div>

                  <div className={styles.partyMemberHP}>
                    {member && (
                      <>
                        HP: {member.currentHp}/{member.maxHp}
                      </>
                    )}
                  </div>

                  <div className={styles.partyMemberLevel}>
                    {member ? `Lv ${member.level}` : ""}
                  </div>
                </div>
              </button>

              {/* --- Equipment --- */}
              {member && (
                <div className={styles.partyMemberEquipment}>
                  <div className={styles.partyMemberWAA}>
                    {["weapon", "armor", "accessory"].map((slot) => (
                      <button
                        key={slot}
                        className={`${styles.partyMemberHeaderButton} ${
                          selectedEquipmentSlot === `${slot}${slotIndex}`
                            ? styles.selectedEquipmentSlot
                            : ""
                        }`}
                        onClick={() =>
                          handleSelectEquipmentSlot(slot, member, slotIndex)
                        }
                      >
                        <div>
                          {slot.charAt(0).toUpperCase() + slot.slice(1)}:{" "}
                          {equip[slot] || "None"}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className={styles.partyMemberEquippedItems}>
                    {["item1", "item2", "item3"].map((slot) => (
                      <button
                        key={slot}
                        className={`${styles.partyMemberHeaderButton} ${
                          selectedEquipmentSlot === `${slot}${slotIndex}`
                            ? styles.selectedEquipmentSlot
                            : ""
                        }`}
                        onClick={() =>
                          handleSelectEquipmentSlot(slot, member, slotIndex)
                        }
                      >
                        <div>
                          {slot.replace("item", "Item ")}:{" "}
                          {equip[slot] || "None"}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* --- Item Description --- */}
      <div className={styles.itemInfo}>
        {selectedItem && selectedItem.item.description}
      </div>

      {/* --- Buttons --- */}
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
