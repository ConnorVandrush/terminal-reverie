import { createSlice } from "@reduxjs/toolkit";

const EncounterSlice = createSlice({
  name: "EncounterSlice",
  initialState: {
    enemies: [null, null, null, null, null, null, null, null],
    target: null,
    selectedAction: null,
    selectedActionType: null,
    turnOrder: [],
    readOutMessages: [],
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
    },
    setTurnOrder(state, action) {
      state.turnOrder = action.payload;
    },
    addReadOutMessage(state, action) {
      state.readOutMessages.push(action.payload);
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
  addReadOutMessage,
} = EncounterSlice.actions;
export default EncounterSlice.reducer;
