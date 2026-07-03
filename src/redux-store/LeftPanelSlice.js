import { createSlice } from "@reduxjs/toolkit";

const LeftPanelSlice = createSlice({
  name: "LeftPanelSlice",
  initialState: {
    leftPanel: "LoginComponent",
  },
  reducers: {
    setLeftPanel: (state, action) => {
      state.leftPanel = action.payload;
    },
  },
});

export const { setLeftPanel } = LeftPanelSlice.actions;
export default LeftPanelSlice.reducer;
