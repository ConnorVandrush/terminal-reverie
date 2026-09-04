import { createSlice } from "@reduxjs/toolkit";

const ShopSlice = createSlice({
  name: "ShopSlice",
  initialState: {
    shopInventory: {},
    selectedShopItem: null,
  },
  reducers: {
    clientRequestOpenShop(store, action) {
      // emit handled in emitters
    },

    openShop(store, action) {
      store.shopInventory = action.payload;
    },

    setSelectedShopItem(store, action) {
      store.selectedShopItem = action.payload;
    },

    clientBuyOrSellItem(store, action) {
      // emit handled in emitters
    },
  },
});

export const {
  clientRequestOpenShop,
  openShop,
  setSelectedShopItem,
  clientBuyOrSellItem,
} = ShopSlice.actions;

export default ShopSlice.reducer;
