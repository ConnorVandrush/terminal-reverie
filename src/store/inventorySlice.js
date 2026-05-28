import { createSlice } from "@reduxjs/toolkit";

const inventorySlice = createSlice({
  name: "inventory",
  initialState: {
    inventory: {},
    selectedItem: null,
  },
  reducers: {
    setInventory: (state, action) => {
      state.inventory = action.payload;
    },
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    clientUseItem: (state, action) => {
      // emit handled in inventoryEmitters.js
    },
  },
});

export const { setInventory, setSelectedItem, clientUseItem } =
  inventorySlice.actions;
export default inventorySlice.reducer;
