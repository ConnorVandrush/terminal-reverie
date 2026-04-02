import { createSlice } from '@reduxjs/toolkit';

const statsSlice = createSlice(
{
    name: 'stats',
    initialState: 
    {
        name: '',
        level: 0,
        experience: 0,
        gold: 0,
        currentHp: 0,
        maxHp: 0,
    },
    reducers: 
    {
        setName: (state, action) =>
        {
            state.name = action.payload;
        },
        setLevel: (state, action) =>
        {
            state.level = action.payload;
        },
        setExperience: (state, action) =>
        {
            state.experience = action.payload;
        },
        setGold: (state, action) =>
        {
            state.gold = action.payload;
        },
        setCurrentHp: (state, action) =>
        {
            state.currentHp = action.payload;
        },
        setMaxHp: (state, action) =>
        {
            state.maxHp = action.payload;
        },
        setStats: (state, action) =>
        {
            const { name, level, experience, gold, currentHp, maxHp } = action.payload;
            state.name = name;
            state.level = level;
            state.experience = experience;
            state.gold = gold;
            state.currentHp = currentHp;
            state.maxHp = maxHp;
        }
    },
});

export const { setName, setLevel, setExperience, setGold, setCurrentHp, setMaxHp, setStats } = statsSlice.actions;
export default statsSlice.reducer;