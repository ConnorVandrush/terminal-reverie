import { configureStore } from "@reduxjs/toolkit";

import { CustomMiddleware } from "./CustomMiddleware";
import LoginSliceReducer from "./login/LoginSlice";
import LeftPanelReducer from "./ui/LeftPanelSlice";
import RightPanelReducer from "./ui/RightPanelSlice";

export const Store = configureStore({
  reducer: {
    LoginSlice: LoginSliceReducer,
    LeftPanelSlice: LeftPanelReducer,
    RightPanelSlice: RightPanelReducer,
  },
  middleware: (getDefault) => getDefault().concat(CustomMiddleware),
});

export default Store;
