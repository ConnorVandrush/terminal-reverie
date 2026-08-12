import { createSlice } from "@reduxjs/toolkit";

const EncounterSlice = createSlice({
  name: "EncounterSlice",
  initialState: {
    enemies: [null, null, null, null, null, null, null, null],
    target: null,
    selectedAction: null,
    selectedActionType: null,
  },
  reducers: {
    setEnemyData(state, action) {
      const { enemyIndex, enemyData } = action.payload;
      state.enemies[enemyIndex] = enemyData;
    },
    setTarget(state, action) {
      state.target = action.payload;
    },
    setSelectedAction(state, action) {
      state.selectedAction = action.payload;
    },
    setSelectedActionType(state, action) {
      state.selectedActionType = action.payload;
    },
  },
});

export const {
  setEnemyData,
  setTarget,
  setSelectedAction,
  setSelectedActionType,
} = EncounterSlice.actions;
export default EncounterSlice.reducer;
