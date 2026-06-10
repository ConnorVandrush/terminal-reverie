export default async function inventoryEmitters(action, store) {
  const socket = window.clientGlobalManager.clientPlayerManager.socket;
  if (action.type === "inventory/clientUseItem") {
    const response = await socket.emitWithAck("clientUseItem", action.payload);

    if (response.success) {
      const index =
        window.clientGlobalManager.clientPartyManager.partyData.members.findIndex(
          (member) => member.playerId === response.updatedTarget.playerId,
        );
      window.clientGlobalManager.clientPartyManager.partyData.members[index] =
        response.updatedTarget;
      const partyDataClone = structuredClone(
        window.clientGlobalManager.clientPartyManager.partyData,
      );
      store.dispatch({
        type: "partyWindow/setPartyData",
        payload: partyDataClone,
      });
      store.dispatch({
        type: "inventory/setInventory",
        payload: response.updatedInventory,
      });
    }
  }
  if (action.type === "inventory/clientEquipItem") {
    const response = await socket.emitWithAck(
      "clientEquipItem",
      action.payload,
    );

    if (response.success) {
      const state = store.getState().partyWindow;

      const partyMembers = state.partyData.members;
      const memberIndex = partyMembers.findIndex(
        (m) => m.playerId === response.updatedTarget.playerId,
      );

      const equipmentSlot = state.selectedEquipmentSlot.slice(0, -1);

      const itemObj = response.updatedEquipment[equipmentSlot];
      const itemName = itemObj ? itemObj.item.name : null;

      store.dispatch({
        type: "partyWindow/setMemberEquipment",
        payload: {
          memberIndex,
          equipmentSlot,
          itemName,
        },
      });

      store.dispatch({
        type: "inventory/setInventory",
        payload: response.updatedInventory,
      });
    }
  }

  if (action.type === "inventory/clientUnequipItem") {
    const response = await socket.emitWithAck(
      "clientUnequipItem",
      action.payload,
    );

    if (response.success) {
      const state = store.getState().partyWindow;

      const partyMembers = state.partyData.members;
      const memberIndex = partyMembers.findIndex(
        (m) => m.playerId === response.updatedTarget.playerId,
      );

      const equipmentSlot = state.selectedEquipmentSlot.slice(0, -1);
      const itemName = null;

      store.dispatch({
        type: "partyWindow/setMemberEquipment",
        payload: {
          memberIndex,
          equipmentSlot,
          itemName,
        },
      });

      store.dispatch({
        type: "inventory/setInventory",
        payload: response.updatedInventory,
      });
    }
  }
}
