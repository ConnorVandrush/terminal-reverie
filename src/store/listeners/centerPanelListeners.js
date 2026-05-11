import { createListenerMiddleware } from '@reduxjs/toolkit';
import { setCenterPanel } from '../centerPanelSlice';

export const centerPanelListener = createListenerMiddleware();

centerPanelListener.startListening({
    actionCreator: setCenterPanel,

    effect: async (action, listenerApi) => 
    {
        const newPanel = action.payload;

        // State BEFORE this action was processed
        const originalState = listenerApi.getOriginalState();
        const currentPanel = originalState.centerPanel.centerPanel;

        // 🔒 Block panel changes while shop window is open
        if (currentPanel === 'shopWindow' && newPanel !== null) 
        {
            listenerApi.dispatch(setCenterPanel('shopWindow'));
            return;
        }

        // 🔒 Block panel changes while in a trade, but allow closing the trade window
        if (currentPanel === 'tradeWindow' && newPanel !== null)
        {
            listenerApi.dispatch(setCenterPanel('tradeWindow'));
            return;
        }
    }
});
