import { clientUseSelectedItem } from "@store/inventory/InventorySlice";
import { clientUnequipItem } from "@store/inventory/InventorySlice";

export default function InventorySliceEmitters(store, action) {
  try {
    if (action.type === clientUseSelectedItem.type) {
      window.clientAPI.authNamespace.emit(
        "clientUseSelectedItem",
        action.payload,
      );
    }
    if (action.type === clientUnequipItem.type) {
      window.clientAPI.authNamespace.emit("clientUnequipItem", action.payload);
    }
  } catch (error) {
    console.error(error);
  }
}
