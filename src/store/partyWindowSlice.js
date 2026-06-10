import { createSlice } from "@reduxjs/toolkit";

const partyWindowSlice = createSlice({
  name: "partyWindow",
  initialState: {
    partyData: null,
    errorMessage: null,
    successMessage: null,
    selectedPartyMember: null,
    selectedEquipmentSlot: null,
    isOwnEquipmentSlot: false,
    partyInvites: [],
    equipment: [
      {
        weapon: null,
        armor: null,
        accessory: null,
        item1: null,
        item2: null,
        item3: null,
      }, // member 0
      {
        weapon: null,
        armor: null,
        accessory: null,
        item1: null,
        item2: null,
        item3: null,
      }, // member 1
      {
        weapon: null,
        armor: null,
        accessory: null,
        item1: null,
        item2: null,
        item3: null,
      }, // member 2
      {
        weapon: null,
        armor: null,
        accessory: null,
        item1: null,
        item2: null,
        item3: null,
      }, // member 3
    ],
  },
  reducers: {
    setMemberEquipment: (state, action) => {
      const { memberIndex, equipmentSlot, itemName } = action.payload;
      if (itemName === null) {
        state.equipment[memberIndex][equipmentSlot] = null;
      } else {
        state.equipment[memberIndex][equipmentSlot] = itemName;
      }
    },
    clientSendPartyInvite: (state, action) => {
      // emit handled in partyWindowEmitters.js
    },
    serverSendPartyInvite: (state, action) => {
      if (
        !state.partyInvites.some(
          (invite) => invite.fromPlayerName === action.payload.fromPlayerName,
        )
      ) {
        state.partyInvites.push(action.payload);
      }
    },
    clientAcceptPartyInvite: (state, action) => {
      // emit handled in partyWindowEmitters.js
    },
    setPartyData: (state, action) => {
      state.partyData = action.payload;
      state.errorMessage = null;
      state.successMessage = null;
    },
    updatePartyData: (state, action) => {
      const { playerId, gold, experience } = action.payload;
      const member = state.members.find((m) => m.playerId === playerId);
      if (member) {
        member.gold += gold;
        member.experience += experience;
      }
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
    removePartyInvite: (state, action) => {
      state.partyInvites = state.partyInvites.filter(
        (invite) => invite.fromPlayerName !== action.payload,
      );
    },
    clientLeaveParty: (state, action) => {
      // emit handled in partyWindowEmitters.js
    },
    clientKickPartyMember: (state, action) => {
      // emit handled in partyWindowEmitters.js
    },
    setSelectedPartyMember: (state, action) => {
      state.selectedPartyMember = action.payload;
    },
    setSelectedEquipmentSlot: (state, action) => {
      state.selectedEquipmentSlot = action.payload;
    },
    setIsOwnEquipmentSlot: (state, action) => {
      state.isOwnEquipmentSlot = action.payload;
    },
  },
});

export const {
  clientSendPartyInvite,
  setPartyData,
  setErrorMessage,
  setSuccessMessage,
  addPartyInvite,
  removePartyInvite,
  clientAcceptPartyInvite,
  serverSendPartyInvite,
  clientLeaveParty,
  clientKickPartyMember,
  updatePartyData,
  setSelectedPartyMember,
  setSelectedEquipmentSlot,
  setIsOwnEquipmentSlot,
  setMemberEquipment,
} = partyWindowSlice.actions;
export default partyWindowSlice.reducer;
