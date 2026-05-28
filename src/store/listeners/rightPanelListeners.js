// rightPanelListeners.js
import { createListenerMiddleware } from "@reduxjs/toolkit";
import { setRightPanel } from "../rightPanelSlice";
import { setSelectedItem } from "../inventorySlice";
import { setSelectedPartyMember } from "../partyWindowSlice";

export const rightPanelListener = createListenerMiddleware();

rightPanelListener.startListening({
  actionCreator: setRightPanel,
  effect: async (action, listenerApi) => {
    const newPanel = action.payload;

    if (newPanel !== "inventoryPanel") {
      listenerApi.dispatch(setSelectedItem(null));
      listenerApi.dispatch(setSelectedPartyMember(null));
    }
  },
});
