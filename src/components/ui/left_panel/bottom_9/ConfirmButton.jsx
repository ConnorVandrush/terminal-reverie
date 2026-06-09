import React from "react";
import { useSelector, useDispatch } from "react-redux";

import styles from "./ConfirmButton.module.css";

export default function ConirmButton() {
  const dispatch = useDispatch();

  const selectedItem = useSelector((state) => state.inventory.selectedItem);
  const selectedPartyMemberIndex = useSelector(
    (state) => state.partyWindow.selectedPartyMember,
  );
  const selectedEquipmentSlot = useSelector(
    (state) => state.partyWindow.selectedEquipmentSlot,
  );
  const isOwnEquipmentSlot = useSelector(
    (state) => state.partyWindow.isOwnEquipmentSlot,
  );
  const canEquip =
    selectedItem &&
    selectedEquipmentSlot &&
    selectedItem.item.type === selectedEquipmentSlot.replace(/\d+$/, "");

  const equipmentSlot = selectedEquipmentSlot
    ? selectedEquipmentSlot.slice(0, -1)
    : null;

  function confirm() {
    if (selectedItem !== null && selectedPartyMemberIndex !== null) {
      const selectedPartyMemberId =
        window.clientGlobalManager.clientPartyManager.partyData.members[
          selectedPartyMemberIndex
        ].playerId;
      dispatch({
        type: "inventory/clientUseItem",
        payload: { selectedItem, selectedPartyMemberId },
      });
    } else if (
      selectedItem !== null &&
      selectedEquipmentSlot !== null &&
      isOwnEquipmentSlot &&
      canEquip
    ) {
      dispatch({
        type: "inventory/clientEquipItem",
        payload: { selectedItem, equipmentSlot },
      });
    } else {
      Input.virtualClick("ok");
    }
  }
  return <button className={styles.confirmationButton} onClick={confirm} />;
}
