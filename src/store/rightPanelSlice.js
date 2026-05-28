import { createSlice } from "@reduxjs/toolkit";

const rightPanelSlice = createSlice({
  name: "rightPanel",
  initialState: {
    rightPanel: null,
  },
  reducers: {
    setRightPanel: (state, action) => {
      state.rightPanel = action.payload;
    },
  },
});

export const { setRightPanel } = rightPanelSlice.actions;
export default rightPanelSlice.reducer;
