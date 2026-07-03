import { configureStore } from "@reduxjs/toolkit";

import LoginSliceReducer from "./LoginSlice";
import LeftPanelReducer from "./LeftPanelSlice";
import RightPanelReducer from "./RightPanelSlice";

export const Store = configureStore({
  reducer: {
    LoginSlice: LoginSliceReducer,
    LeftPanelSlice: LeftPanelReducer,
    RightPanelSlice: RightPanelReducer,
  },
  middleware: (getDefault) => getDefault({}),
});

export default Store;
