import LoginSliceEmitters from "@io/login/LoginSliceEmitters";
import LoginSliceListeners from "@io/login/LoginSliceListeners";
import ChatSliceEmitters from "@io/chat/ChatSliceEmitters";
import PartySliceEmitters from "@io/party/PartySliceEmitters";
import ChatSliceListeners from "@io/chat/ChatSliceListeners";
import PartySliceListeners from "@io/party/PartySliceListeners";
import EncounterSliceEmitters from "@io/encounter/EncounterSliceEmitters";
import EncounterSliceListeners from "@io/encounter/EncounterSliceListeners";

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
      PartySliceListeners(store, action);
      EncounterSliceListeners(store, action);
    }

    LoginSliceEmitters(store, action);
    ChatSliceEmitters(store, action);
    PartySliceEmitters(store, action);
    EncounterSliceEmitters(store, action);

    return next(action);
  };
};
