import { configureStore } from "@reduxjs/toolkit";

import { CustomMiddleware } from "./CustomMiddleware";
import LoginSliceReducer from "./login/LoginSlice";
import LeftPanelReducer from "./ui/LeftPanelSlice";
import RightPanelReducer from "./ui/RightPanelSlice";
import CenterPanelReducer from "./ui/CenterPanelSlice";
import BottomPanelReducer from "./ui/BottomPanelSlice";
import PartySliceReducer from "./party/PartySlice";
import ChatSliceReducer from "./chat/ChatSlice";

export const Store = configureStore({
  reducer: {
    LoginSlice: LoginSliceReducer,
    LeftPanelSlice: LeftPanelReducer,
    RightPanelSlice: RightPanelReducer,
    CenterPanelSlice: CenterPanelReducer,
    BottomPanelSlice: BottomPanelReducer,
    PartySlice: PartySliceReducer,
    ChatSlice: ChatSliceReducer,
  },
  middleware: (getDefault) => getDefault().concat(CustomMiddleware),
});

export default Store;
