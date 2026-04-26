import { createSlice } from '@reduxjs/toolkit';

const inventorySlice = createSlice(
{
    name: 'inventory',
    initialState: 
    {
        inventory: {},
        selectedItem: null
    },
    reducers:
    {
        setInventory: (state, action) =>
        {
            state.inventory = action.payload;
        },
        setSelectedItem: (state, action) => 
        {
            state.selectedItem = action.payload;
        }
    }
});

export const { setInventory, setSelectedItem } = inventorySlice.actions;
export default inventorySlice.reducer;