import { createSlice } from '@reduxjs/toolkit';

const centerPanelSlice = createSlice(
{
    name: 'centerPanel',
    initialState: 
    {
        centerPanel: null,
    },
    reducers: 
    {
        setCenterPanel: (state, action) => 
        {
            state.centerPanel = action.payload;
        },
    },
});

export const { setCenterPanel } = centerPanelSlice.actions;
export default centerPanelSlice.reducer;