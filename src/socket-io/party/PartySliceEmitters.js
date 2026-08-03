import {
  clientSendPartyInvite,
  setSuccessMessage,
  setErrorMessage,
  clientAcceptPartyInvite,
} from "@store/party/PartySlice";

export default async function PartySliceEmitters(store, action) {
  try {
    if (action.type === clientSendPartyInvite.type) {
      const { success, message } =
        await window.clientAPI.authNamespace.emitWithAck(
          "clientSendPartyInvite",
          action.payload,
        );
      if (!success) store.dispatch(setErrorMessage(message));
      if (success) store.dispatch(setSuccessMessage(message));
    }

    if (action.type === clientAcceptPartyInvite.type) {
      const { success, message } =
        await window.clientAPI.authNamespace.emitWithAck(
          "clientAcceptPartyInvite",
          action.payload,
        );
      if (!success) store.dispatch(setErrorMessage(message));
      if (success) store.dispatch(setSuccessMessage(message));
    }
  } catch (error) {
    console.error("PartySliceEmitters:", error);
    store.dispatch(setErrorMessage("Unexpected error occurred."));
  }
}
