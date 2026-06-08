import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setSelectedPartyMember,
  setSelectedEquipmentSlot,
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

  const selectedEquipmentSlot = useSelector(
    (state) => state.partyWindow.selectedEquipmentSlot,
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

  const selectedItem = useSelector((state) => {
    return state.inventory.selectedItem;
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

    dispatch(setSelectedEquipmentSlot(null));

    dispatch(
      setSelectedPartyMember(
        selectedPartyMember === slotIndex ? null : slotIndex,
      ),
    );
  };

  const handleSelectEquipmentSlot = (slot, member) => {
    if (!member) return;

    dispatch(setSelectedPartyMember(null));

    dispatch(
      setSelectedEquipmentSlot(selectedEquipmentSlot === slot ? null : slot),
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

          const weaponSelected = selectedEquipmentSlot === "weapon" + slotIndex;
          const armorSelected = selectedEquipmentSlot === "armor" + slotIndex;
          const accessorySelected =
            selectedEquipmentSlot === "accessory" + slotIndex;
          const item1Selected = selectedEquipmentSlot === "item1" + slotIndex;
          const item2Selected = selectedEquipmentSlot === "item2" + slotIndex;
          const item3Selected = selectedEquipmentSlot === "item3" + slotIndex;

          return (
            <div key={slotIndex} className={styles.partyMemberDiv}>
              <button
                disabled={!member}
                className={`
      ${styles.partyMemberHeaderButton}
      ${isSelected ? styles.selectedPartyMember : ""}
    `}
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

              <div className={styles.partyMemberEquipment}>
                {member && (
                  <>
                    <div className={styles.partyMemberWAA}>
                      <button
                        className={`
            ${styles.partyMemberHeaderButton}
            ${selectedEquipmentSlot === "weapon" + slotIndex ? styles.selectedEquipmentSlot : ""}
          `}
                        onClick={() =>
                          handleSelectEquipmentSlot(
                            "weapon" + slotIndex,
                            member,
                          )
                        }
                      >
                        <div>Weapon: {member.equipment.weapon || "None"}</div>
                      </button>

                      <button
                        className={`
            ${styles.partyMemberHeaderButton}
            ${selectedEquipmentSlot === "armor" + slotIndex ? styles.selectedEquipmentSlot : ""}
          `}
                        onClick={() =>
                          handleSelectEquipmentSlot("armor" + slotIndex, member)
                        }
                      >
                        <div>Armor: {member.equipment.armor || "None"}</div>
                      </button>

                      <button
                        className={`
            ${styles.partyMemberHeaderButton}
            ${selectedEquipmentSlot === "accessory" + slotIndex ? styles.selectedEquipmentSlot : ""}
          `}
                        onClick={() =>
                          handleSelectEquipmentSlot(
                            "accessory" + slotIndex,
                            member,
                          )
                        }
                      >
                        <div>
                          Accessory: {member.equipment.accessory || "None"}
                        </div>
                      </button>
                    </div>

                    <div className={styles.partyMemberEquippedItems}>
                      <button
                        className={`
            ${styles.partyMemberHeaderButton}
            ${selectedEquipmentSlot === "item1" + slotIndex ? styles.selectedEquipmentSlot : ""}
          `}
                        onClick={() =>
                          handleSelectEquipmentSlot("item1" + slotIndex, member)
                        }
                      >
                        <div>Item 1: {member.equipment.item1 || "None"}</div>
                      </button>

                      <button
                        className={`
            ${styles.partyMemberHeaderButton}
            ${selectedEquipmentSlot === "item2" + slotIndex ? styles.selectedEquipmentSlot : ""}
          `}
                        onClick={() =>
                          handleSelectEquipmentSlot("item2" + slotIndex, member)
                        }
                      >
                        <div>Item 2: {member.equipment.item2 || "None"}</div>
                      </button>

                      <button
                        className={`
            ${styles.partyMemberHeaderButton}
            ${selectedEquipmentSlot === "item3" + slotIndex ? styles.selectedEquipmentSlot : ""}
          `}
                        onClick={() =>
                          handleSelectEquipmentSlot("item3" + slotIndex, member)
                        }
                      >
                        <div>Item 3: {member.equipment.item3 || "None"}</div>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.itemInfo}>
        {selectedItem && selectedItem.item.description}
      </div>

      <div className={styles.buttonContainer}>
        <button
          data-testid="join-invite-button"
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
