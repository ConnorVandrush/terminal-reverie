import { configureStore } from "@reduxjs/toolkit";
import { middleware } from "../socketIO/middleware";
import leftPanelReducer from "./leftPanelSlice";
import loginReducer from "./loginSlice";
import createCharacterReducer from "./createCharacterSlice";
import centerPanelReducer from "./centerPanelSlice";
import rightPanelReducer from "./rightPanelSlice";

export const store = configureStore(
{
    reducer: 
    {
        leftPanel: leftPanelReducer,
        login: loginReducer,
        createCharacter: createCharacterReducer,
        centerPanel: centerPanelReducer,
        rightPanel: rightPanelReducer,
    },
    middleware: (getDefault) =>
    getDefault().concat(middleware),
});

export default store;