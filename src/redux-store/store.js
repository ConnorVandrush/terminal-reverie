import { configureStore } from "@reduxjs/toolkit";

import { CustomMiddleware } from "./CustomMiddleware";
import LoginSliceReducer from "./login/LoginSlice";
import LeftPanelReducer from "./ui/LeftPanelSlice";
import RightPanelReducer from "./ui/RightPanelSlice";
import CenterPanelReducer from "./ui/CenterPanelSlice";
import BottomPanelReducer from "./ui/BottomPanelSlice";
import PartySliceReducer from "./party/PartySlice";
import ChatSliceReducer from "./chat/ChatSlice";
import EncounterSliceReducer from "./encounter/EncounterSlice";
import InventorySliceReducer from "./inventory/InventorySlice";
import ShopSliceReducer from "./shop/ShopSlice";

export const Store = configureStore({
  reducer: {
    LoginSlice: LoginSliceReducer,
    LeftPanelSlice: LeftPanelReducer,
    RightPanelSlice: RightPanelReducer,
    CenterPanelSlice: CenterPanelReducer,
    BottomPanelSlice: BottomPanelReducer,
    PartySlice: PartySliceReducer,
    ChatSlice: ChatSliceReducer,
    EncounterSlice: EncounterSliceReducer,
    InventorySlice: InventorySliceReducer,
    ShopSlice: ShopSliceReducer,
  },
  middleware: (getDefault) => getDefault().concat(CustomMiddleware),
});

export default Store;
