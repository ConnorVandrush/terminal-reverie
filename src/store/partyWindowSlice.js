import { createSlice } from '@reduxjs/toolkit';

const partyWindowSlice = createSlice(
{
    name: 'partyWindow',
    initialState:
    {
        partyData: null,
        errorMessage: null,
        successMessage: null,
        selectedPartyMember: null,
        partyInvites: [],
    },
    reducers:
    {
        clientSendPartyInvite: (state, action) =>
        {
            // emit handled in partyWindowEmitters.js
        },
        serverSendPartyInvite: (state, action) =>
        {
            if (!state.partyInvites.some(invite => invite.fromPlayerName === action.payload.fromPlayerName))
            {
                state.partyInvites.push(action.payload);
            }
        },
        clientAcceptPartyInvite: (state, action) =>
        {
            // emit handled in partyWindowEmitters.js
        },
        setPartyData: (state, action) =>
        {
            state.partyData = action.payload;
            state.errorMessage = null;
            state.successMessage = null;
        },
        updatePartyData: (state, action) =>
        {
            const { playerId, gold, experience } = action.payload;
            const member = state.members.find(m => m.playerId === playerId);
            if (member) 
            {
                member.gold += gold;
                member.experience += experience;
            }
        },
        setErrorMessage: (state, action) =>
        {
            state.errorMessage = action.payload;
        },
        setSuccessMessage: (state, action) =>
        {
            state.successMessage = action.payload;
        },
        removePartyInvite: (state, action) =>
        {
            state.partyInvites = state.partyInvites.filter(invite => invite.fromPlayerName !== action.payload);
        },
        clientLeaveParty: (state, action) =>
        {
            // emit handled in partyWindowEmitters.js
        },
        clientKickPartyMember: (state, action) =>
        {
            // emit handled in partyWindowEmitters.js
        },
        setSelectedPartyMember: (state, action) =>
        {
            state.selectedPartyMember = action.payload;
        }
    },
});

export const { clientSendPartyInvite, setParty, setErrorMessage, setSuccessMessage, addPartyInvite, removePartyInvite, clientAcceptPartyInvite, serverSendPartyInvite, clientLeaveParty, clientKickPartyMember, updatePartyData, setSelectedPartyMember } = partyWindowSlice.actions;
export default partyWindowSlice.reducer;