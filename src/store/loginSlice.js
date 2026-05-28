import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
  name: "login",

  initialState: {
    errorMessage: false,
    successMessage: false,
  },

  reducers: {
    clientLogin: () => {
      // emit handled in loginEmitters.js
    },
    clientRegister: () => {
      // emit handled in loginEmitters.js
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
  },
});

export const {
  clientLogin,
  clientRegister,
  setErrorMessage,
  setSuccessMessage,
} = loginSlice.actions;
export default loginSlice.reducer;
