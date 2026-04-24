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
        },
        clearSelectedItem: (state) => 
        {
            state.selectedItem = null;
        }
    }
});

export const { setInventory, setSelectedItem, clearSelectedItem } = inventorySlice.actions;
export default inventorySlice.reducer;