import { configureStore } from "@reduxjs/toolkit";
import { middleware } from "../../server/socketIO/middleware";
import leftPanelReducer from "./leftPanelSlice";
import loginReducer from "./loginSlice";

export const store = configureStore(
{
    reducer: 
    {
        leftPanel: leftPanelReducer,
        login: loginReducer,
    },
    middleware: (getDefault) =>
    getDefault().concat(middleware),
});

export default store;