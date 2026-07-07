import { createSlice } from "@reduxjs/toolkit";

const CenterPanelSlice = createSlice({
  name: "CenterPanelSlice",
  initialState: {
    centerPanel: null,
  },
  reducers: {
    setCenterPanel: (state, action) => {
      state.centerPanel = action.payload;
    },
  },
});

export const { setCenterPanel } = CenterPanelSlice.actions;
export default CenterPanelSlice.reducer;
