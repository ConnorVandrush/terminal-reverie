import { createSlice } from "@reduxjs/toolkit";

const InventorySlice = createSlice({
  name: "InventorySlice",
  initialState: {
    selectedItem: null,
  },
  reducers: {
    setSelectedItem(state, action) {
      state.selectedItem = action.payload;
    },
    clientUseSelectedItem(state, action) {
      // emit handled in emitters
    },
  },
});

export const { setSelectedItem, clientUseSelectedItem } =
  InventorySlice.actions;
export default InventorySlice.reducer;
