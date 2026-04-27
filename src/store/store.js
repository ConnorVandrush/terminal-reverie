import { configureStore } from "@reduxjs/toolkit";
import { middleware } from "../socketIO/middleware";
import leftPanelReducer from "./leftPanelSlice";
import loginReducer from "./loginSlice";
import createCharacterReducer from "./createCharacterSlice";
import centerPanelReducer from "./centerPanelSlice";
import rightPanelReducer from "./rightPanelSlice";
import chatWindowReducer from "./chatWindowSlice";
import partWindowReducer from "./partyWindowSlice";
import encounterReducer from "./encounterSlice";
import inventoryReducer from "./inventorySlice";
import { rightPanelListener } from "./listeners/rightPanelListeners";

export const store = configureStore(
{
    reducer: 
    {
        leftPanel: leftPanelReducer,
        login: loginReducer,
        createCharacter: createCharacterReducer,
        centerPanel: centerPanelReducer,
        rightPanel: rightPanelReducer,
        chatWindow: chatWindowReducer,
        partyWindow: partWindowReducer,
        encounter: encounterReducer,
        inventory: inventoryReducer
    },
    middleware: (getDefault) =>
    getDefault(
        {
            serializableCheck:
            {
                ignoredActions: ['createCharacter/setCreateCharacterCB'], // Ignore the createCharacterCB action for serializability checks
                ignoredPaths: ['createCharacter.createCharacterCB'], // Ignore the createCharacterCB field in the state for serializability checks
            }
        }
    )
    .prepend(rightPanelListener.middleware)
    .concat(middleware),
});

export default store;