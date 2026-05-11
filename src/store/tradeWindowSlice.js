import { createSlice } from '@reduxjs/toolkit';

const tradeWindowSlice = createSlice(
{
    name: 'tradeWindow',
    initialState:
    {
        errorMessage: null,
        successMessage: null,
        tradeRequests: [],
        tradePartner: null,
        theirOffer: { items: [], gold: 0 },
        yourOffer: { items: [], gold: 0 }
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
            state.tradeRequests = state.tradeRequests.filter(request => request.fromPlayerName !== action.payload);
            // emit handled in tradeWindowEmitters.js
        },
        removeTradeRequest: (state, action) =>
        {
            state.tradeRequests = state.tradeRequests.filter(request => request.fromPlayerName !== action.payload);
        },
        serverSendTradeRequest: (state, action) =>
        {
            if (!state.tradeRequests.some(request => request.fromPlayerName === action.payload.fromPlayerName))
            {
                state.tradeRequests.push(action.payload);
            }
        },
        serverTradeRequestAccepted: (state, action) =>
        {
            state.tradeRequests = state.tradeRequests.filter(request => request.fromPlayerName !== action.payload.fromPlayerName);
            state.tradePartner = action.payload.fromPlayerName;
        },
        clientTradeDeclined: (state, action) =>
        {
            // emit handled in tradeWindowEmitters.js
        },
        setTradePartner: (state, action) =>
        {
            state.tradePartner = action.payload;
        },
        setTheirOffer: (state, action) =>
        {
            state.theirOffer = action.payload;
        },
        setYourOffer: (state, action) =>
        {
            state.yourOffer = action.payload;
        }
    }
});

export const { setErrorMessage, setSuccessMessage, clientSendTradeRequest, serverReceiveTradeRequest, clientAcceptTradeRequest, removeTradeRequest, serverSendTradeRequest, serverTradeRequestAccepted, clientTradeDeclined, setTradePartner, setTheirOffer, setYourOffer } = tradeWindowSlice.actions;
export default tradeWindowSlice.reducer;