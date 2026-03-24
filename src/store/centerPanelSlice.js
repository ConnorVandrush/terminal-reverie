import { createSlice } from '@reduxjs/toolkit';

const centerPanelSlice = createSlice(
{
    name: 'centerPanel',
    initialState: 
    {
        centerPanel: null,
        chatMessages: [],
    },
    reducers: 
    {
        setCenterPanel: (state, action) => 
        {
            state.centerPanel = action.payload;
        }
    },
});

export const { setCenterPanel, clientSendChatMessage, serverBroadcastChatMessage } = centerPanelSlice.actions;
export default centerPanelSlice.reducer;