import { createSlice } from "@reduxjs/toolkit";

const EncounterSlice = createSlice({
  name: "EncounterSlice",
  initialState: {
    enemies: [null, null, null, null, null, null, null, null],
    target: null,
    selectedAction: null,
    selectedActionType: null,
    turnOrder: [],
    encounterMessages: [],
    roundNumber: null,
  },
  reducers: {
    setEnemyData(state, action) {
      const { enemyIndex, enemyData } = action.payload;
      state.enemies[enemyIndex] = enemyData;
    },
    setEncounterTarget(state, action) {
      state.target = action.payload;
    },
    setSelectedAction(state, action) {
      state.selectedAction = action.payload;
    },
    setSelectedActionType(state, action) {
      state.selectedActionType = action.payload;
    },
    clientSubmitEncounterAction(state, action) {
      // emit handled in EncounterSliceEmitters.js
      state.selectedAction = null;
      state.selectedActionType = null;
      state.target = null;
    },
    setTurnOrder(state, action) {
      state.turnOrder = action.payload;
    },
    addEncounterMessage(state, action) {
      state.encounterMessages.push(action.payload);
    },
    clearEncounterMessages(state, action) {
      state.encounterMessages = [];
    },
    setPlayerHp(state, action) {
      const { playerIndex, currentHp } = action.payload;

      if (state.partyMembers[playerIndex]) {
        state.partyMembers[playerIndex].currentHp = currentHp;
      }
    },
    removeEnemy(state, action) {
      state.enemies.splice(action.payload, 1);
    },
    setRoundNumber(state, action) {
      state.roundNumber = action.payload;
    },
    incrementRoundNumber(state, action) {
      state.roundNumber++;
    },
  },
});

export const {
  setEnemyData,
  setEncounterTarget,
  setSelectedAction,
  setSelectedActionType,
  clientSubmitEncounterAction,
  setTurnOrder,
  addEncounterMessage,
  clearEncounterMessages,
  removeEnemy,
  setRoundNumber,
  incrementRoundNumber,
} = EncounterSlice.actions;
export default EncounterSlice.reducer;
