import { clientSubmitEncounterAction } from "@store/encounter/EncounterSlice.js";

export default async function EncounterSliceEmitters(store, action) {
  try {
    if (action.type === clientSubmitEncounterAction.type) {
      window.clientAPI.authNamespace.emit(
        "clientSubmitEncounterAction",
        action.payload,
      );
    }
  } catch (error) {
    console.error(error);
  }
}
