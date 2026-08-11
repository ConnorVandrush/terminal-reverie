import { createSlice } from "@reduxjs/toolkit";

const EncounterSlice = createSlice({
  name: "EncounterSlice",
  initialState: {
    enemies: [null, null, null, null, null, null, null, null],
  },
  reducers: {
    setEnemyData(state, action) {
      const { enemyIndex, enemyData } = action.payload;

      state.enemies[enemyIndex] = enemyData;
    },
  },
});

export const { setEnemyData } = EncounterSlice.actions;
export default EncounterSlice.reducer;
