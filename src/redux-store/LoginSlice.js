import { createSlice } from "@reduxjs/toolkit";

const LoginSlice = createSlice({
  name: "LoginSlice",

  initialState: {
    errorMessage: null,
    successMessage: null,
  },

  reducers: {
    clientLogin: () => {
      // emit handled in LoginEmitters.js
    },
    clientRegister: () => {
      // emit handled in LoginEmitters.js
    },
    setErrorMessage: (state, action) => {
      state.successMessage = null;
      state.errorMessage = action.payload;
    },
    setSuccessMessage: (state, action) => {
      state.errorMessage = null;
      state.successMessage = action.payload;
    },
  },
});

export const {
  clientLogin,
  clientRegister,
  setErrorMessage,
  setSuccessMessage,
} = LoginSlice.actions;
export default LoginSlice.reducer;
