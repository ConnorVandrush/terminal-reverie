import { createSlice } from "@reduxjs/toolkit";

const RightPanelSlice = createSlice({
  name: "RightPanelSlice",
  initialState: {
    rightPanel: null,
  },
  reducers: {
    setRightPanel: (state, action) => {
      state.rightPanel = action.payload;
    },
  },
});

export const { setRightPanel } = RightPanelSlice.actions;
export default RightPanelSlice.reducer;
