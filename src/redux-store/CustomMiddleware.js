import LoginSliceEmitters from "@io/login/LoginSliceEmitters";

export const CustomMiddleware = (store) => {
  let initialized = false;

  return (next) => (action) => {
    if (!initialized) {
      initialized = true;
      window.clientAPI.dispatchToReact = store.dispatch;
      window.clientAPI.getReactState = store.getState;
    }

    LoginSliceEmitters(store, action);

    return next(action);
  };
};
