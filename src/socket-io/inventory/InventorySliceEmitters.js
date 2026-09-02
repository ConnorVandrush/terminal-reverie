import { clientUseSelectedItem } from "@store/inventory/InventorySlice";

export default function InventorySliceEmitters(store, action) {
  try {
    if (action.type === clientUseSelectedItem.type) {
      window.clientAPI.authNamespace.emit(
        "clientUseSelectedItem",
        action.payload,
      );
    }
  } catch (error) {
    console.error(error);
  }
}
