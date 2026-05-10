import { createSlice } from '@reduxjs/toolkit';

const tradeWindowSlice = createSlice(
{
    name: 'tradeWindow',
    initialState:
    {
        errorMessage: null,
        successMessage: null,
        tradeRequests: [],
    },
    reducers:
    {
        setErrorMessage: (state, action) =>
        {
            state.errorMessage = action.payload;
        },
        setSuccessMessage: (state, action) =>
        {
            state.successMessage = action.payload;
        },
        clientSendTradeRequest: (state, action) =>
        {
            // emit handled in tradeWindowEmitters.js
        },
        serverReceiveTradeRequest: (state, action) =>
        {
            if (!state.tradeRequests.some(request => request.fromPlayerName === action.payload.fromPlayerName))
            {
                state.tradeRequests.push(action.payload);
            }
        },
        clientAcceptTradeRequest: (state, action) =>
        {
            // emit handled in tradeWindowEmitters.js
        },
        removeTradeRequest: (state, action) =>
        {
            state.tradeRequests = state.tradeRequests.filter(request => request.fromPlayerName !== action.payload);
        },
    }
});

export const { setErrorMessage, setSuccessMessage, clientSendTradeRequest, serverReceiveTradeRequest, clientAcceptTradeRequest, removeTradeRequest } = tradeWindowSlice.actions;
export default tradeWindowSlice.reducer;