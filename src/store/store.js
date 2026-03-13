import { configureStore } from "@reduxjs/toolkit";
import { middleware } from "../../server/socketIO/middleware";
import leftPanelReducer from "./leftPanelSlice";

export const store = configureStore(
{
    reducer: 
    {
        leftPanel: leftPanelReducer,
    },
    middleware: (getDefault) =>
    getDefault().concat(middleware),
});

export default store;