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
        theirOfferItems: {},
        yourOfferItems: {},
        theirOfferGold: 0,
        yourOfferGold: 0,
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
        setTheirOfferItems: (state, action) =>
        {
            const { itemId, itemName, qty } = action.payload;
            state.theirOfferItems[itemId] = {
                itemName,
                qty
            };
        },
        setYourOfferItems: (state, action) =>
        {
            const { itemId, itemName, qty } = action.payload;
            state.yourOfferItems[itemId] = {
                itemName,
                qty
            };
        },
        setTheirOfferGold: (state, action) =>
        {
            state.theirOfferGold = action.payload;
        },
        setYourOfferGold: (state, action) =>
        {
            state.yourOfferGold = action.payload;
        },
        clientOfferItemInTrade: (state, action) =>
        {
            // emit handled in tradeWindowEmitters.js
        },
        clientOfferGoldInTrade: (state, action) =>
        {
            // emit handled in tradeWindowEmitters.js
        },
        clientTradeAccepted: (state, action) =>
        {
            // emit handled in tradeWindowEmitters.js
        },
    }
});

export const { clientTradeAccepted, setErrorMessage, setSuccessMessage, clientSendTradeRequest, serverReceiveTradeRequest, clientAcceptTradeRequest, removeTradeRequest, serverSendTradeRequest, serverTradeRequestAccepted, clientTradeDeclined, setTradePartner, setTheirOffer, setYourOffer, clientOfferItemInTrade, clientOfferGoldInTrade } = tradeWindowSlice.actions;
export default tradeWindowSlice.reducer;