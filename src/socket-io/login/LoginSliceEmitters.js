import {
  clientLogin,
  clientRegister,
  setErrorMessage,
  setSuccessMessage,
} from "@store/login/LoginSlice.js";

export default async function LoginSliceEmitters(store, action) {
  if (action.type === clientLogin.type) {
    const { success, error, JWT } =
      await window.clientAPI.loginNamespace.emitWithAck(
        "clientLogin",
        action.payload,
      );
    if (error) {
      store.dispatch(setErrorMessage(error));
    }
    if (success) {
      localStorage.setItem("JWT", JWT);
      window.clientAPI.loginNamespace.disconnect();
      window.clientAPI.playerManager.login();
    }
  }
  if (action.type === clientRegister.type) {
    const { success, error } =
      await window.clientAPI.loginNamespace.emitWithAck(
        "clientRegister",
        action.payload,
      );
    if (error) {
      store.dispatch(setErrorMessage(error));
    }
    if (success) {
      store.dispatch(setSuccessMessage(success));
    }
  }
}
