import LoginSliceEmitters from "@io/login/LoginSliceEmitters";
import LoginSliceListeners from "@io/login/LoginSliceListeners";
import ChatSliceEmitters from "@io/chat/ChatSliceEmitters";
import { ChatSliceListeners } from "@io/chat/ChatSliceListeners";

export const CustomMiddleware = (store) => {
  let initialized = false;
  let authenticated = false;

  return (next) => (action) => {
    if (!initialized) {
      initialized = true;
      window.clientAPI.dispatchToReact = store.dispatch;
      window.clientAPI.getReactState = store.getState;
      LoginSliceListeners(store, action);
    }
    if (!authenticated && window.clientAPI.authNamespace !== null) {
      authenticated = true;
      ChatSliceListeners(store, action);
    }

    LoginSliceEmitters(store, action);
    ChatSliceEmitters(store, action);

    return next(action);
  };
};
