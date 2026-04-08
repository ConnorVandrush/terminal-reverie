import { createSlice } from '@reduxjs/toolkit';

const encounterSlice = createSlice(
{
    name: 'encounter',
    initialState: 
    {
        encounterInfo: 'commandSelection',
    },
    reducers:
    {
        setEncounterInfo: (state, action) =>
        {
            state.encounterInfo = action.payload;
        }
    }
});

export const { setEncounterInfo } = encounterSlice.actions;
export default encounterSlice.reducer;