import { createSlice } from '@reduxjs/toolkit';

const encounterSlice = createSlice(
{
    name: 'encounter',
    initialState: 
    {
        encounterInfo: 'commandSelection',
        enemyInfo: null,
        allyInfo: null,
        currentTarget: null // { index: number, side: 'ally' | 'enemy' }
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
        }
    }
});

export const { setEncounterInfo, setEnemyInfo, setAllyInfo, setCurrentTarget, clientAllyTurn } = encounterSlice.actions;
export default encounterSlice.reducer;