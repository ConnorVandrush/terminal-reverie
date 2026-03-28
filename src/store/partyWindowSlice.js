import { createSlice } from '@reduxjs/toolkit';

const partyWindowSlice = createSlice(
{
    name: 'partyWindow',
    initialState:
    {
        party: null,
        errorMessage: null,
        successMessage: null,
        partyInvites: [],
    },
    reducers:
    {
        clientSendPartyInvite: (state, action) =>
        {
            // emit handled in partyWindowEmitters.js
        },
        setParty: (state, action) =>
        {
            state.party = action.payload;
        },
        setErrorMessage: (state, action) =>
        {
            state.errorMessage = action.payload;
        },
        setSuccessMessage: (state, action) =>
        {
            state.successMessage = action.payload;
        },
        addPartyInvite: (state, action) =>
        {
            state.partyInvites.push(action.payload);
        },
        removePartyInvite: (state, action) =>
        {
            state.partyInvites = state.partyInvites.filter(invite => invite !== action.payload);
        },
    },
});

export const { clientSendPartyInvite, setParty, setErrorMessage, setSuccessMessage, addPartyInvite, removePartyInvite } = partyWindowSlice.actions;
export default partyWindowSlice.reducer;