import { createSlice } from "@reduxjs/toolkit";

const BottomPanelSlice = createSlice({
  name: "BottomPanelSlice",
  initialState: {
    bottomPanel: null,
  },
  reducers: {
    setBottomPanel: (state, action) => {
      state.bottomPanel = action.payload;
    },
  },
});

export const { setBottomPanel } = BottomPanelSlice.actions;
export default BottomPanelSlice.reducer;
