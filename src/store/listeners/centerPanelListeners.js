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

        // Block panel changes while shop window is open
        if (currentPanel === 'shopWindow' && newPanel !== null) 
        {
            // Restore shop window since reducer already updated state
            listenerApi.dispatch(setCenterPanel('shopWindow'));
        }
    }
});