import LoginSliceEmitters from "@io/login/LoginSliceEmitters";
import LoginSliceListeners from "@io/login/LoginSliceListeners";

export const CustomMiddleware = (store) => {
  let initialized = false;

  return (next) => (action) => {
    if (!initialized) {
      initialized = true;
      window.clientAPI.dispatchToReact = store.dispatch;
      window.clientAPI.getReactState = store.getState;
      LoginSliceListeners(store);
    }

    LoginSliceEmitters(store, action);

    return next(action);
  };
};
