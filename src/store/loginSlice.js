import { createSlice } from '@reduxjs/toolkit';

const loginSlice = createSlice(
{
    name: 'login',

    initialState:
    {
        errorMessage: false,
        successMessage: false,
    },

    reducers:
    {
        clientLogin: () =>
        {
            // emit handled in loginEmitters.js
        }
    }
});

export const { clientLogin } = loginSlice.actions;
export default loginSlice.reducer;