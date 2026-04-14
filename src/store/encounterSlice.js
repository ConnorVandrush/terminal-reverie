import { createSlice } from '@reduxjs/toolkit';

const encounterSlice = createSlice(
{
    name: 'encounter',
    initialState: 
    {
        encounterInfo: 'commandSelection',
        enemyInfo: null,
        allyInfo: null,
        currentTarget: null, // { index: number, side: 'ally' | 'enemy' }
        encounterMessages: []
    },
    reducers:
    {
        setEncounterInfo: (state, action) =>
        {
            state.encounterInfo = action.payload;
        },
        setEnemyInfo: (state, action) =>
        {
            state.enemyInfo = action.payload;
        },
        setAllyInfo: (state, action) =>
        {
            state.allyInfo = action.payload;
        },
        setCurrentTarget: (state, action) =>
        {
            state.currentTarget = action.payload;
        },
        clientAllyTurn: (state, action) =>
        {
            // emit handled in encounterEmitters.js
        },
        appendEncounterMessage: (state, action) =>
        {
            state.encounterMessages.unshift(action.payload);
        },
        clearEncounterMessages: (state) =>
        {
            state.encounterMessages = [];
        }
    }
});

export const { setEncounterInfo, setEnemyInfo, setAllyInfo, setCurrentTarget, clientAllyTurn, appendEncounterMessage, clearEncounterMessages } = encounterSlice.actions;
export default encounterSlice.reducer;