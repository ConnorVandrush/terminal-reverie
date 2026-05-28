import { createSlice } from "@reduxjs/toolkit";

const shopWindowSlice = createSlice({
  name: "shopWindow",
  initialState: {
    shopInventory: {},
    selectedShopItem: null,
    message: null,
  },
  reducers: {
    clientRequestOpenShop: (state, action) => {
      // emit handled in shopWindowEmitters.js
    },
    setShopInventory: (state, action) => {
      state.shopInventory = action.payload;
    },
    setSelectedShopItem: (state, action) => {
      state.selectedShopItem = action.payload;
    },
    clientBuyItem: (state, action) => {
      // emit handled in shopWindowEmitters.js
    },
    clientRequestCloseShop: (state, action) => {
      // emit handled in shopWindowEmitters.js
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
  },
});

export const {
  setInventory,
  setSelectedShopItem,
  clientBuyItem,
  clientRequestCloseShop,
  setMessage,
} = shopWindowSlice.actions;
export default shopWindowSlice.reducer;
