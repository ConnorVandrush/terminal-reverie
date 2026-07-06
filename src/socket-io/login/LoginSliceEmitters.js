import { clientLogin, clientRegister } from "@store/login/LoginSlice.js";

export default async function LoginSliceEmitters(store, action) {
  if (action.type === clientLogin.type) {
    const response = await window.clientAPI.login.emitWithAck(
      "clientLogin",
      action.payload,
    );
  }
}
