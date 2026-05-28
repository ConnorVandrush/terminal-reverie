import { createSlice } from "@reduxjs/toolkit";

const leftPanelSlice = createSlice({
  name: "leftPanel",
  initialState: {
    leftPanel: "login",
  },
  reducers: {
    setLeftPanel: (state, action) => {
      state.leftPanel = action.payload;
    },
  },
});

export const { setLeftPanel } = leftPanelSlice.actions;
export default leftPanelSlice.reducer;
