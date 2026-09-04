import { clientRequestOpenShop, openShop } from "@store/shop/ShopSlice";
import { setCenterPanel } from "@store/ui/CenterPanelSlice";

export default async function ShopSliceEmitters(store, action) {
  try {
    if (action.type === clientRequestOpenShop.type) {
      const { success, message, shopInventory } =
        await window.clientAPI.authNamespace.emitWithAck(
          "clientRequestOpenShop",
        );
      if (success) {
        store.dispatch(openShop(shopInventory));
        store.dispatch(setCenterPanel("ShopComponent"));
      } else {
        console.error(message);
      }
    }
  } catch (error) {
    console.error(error);
  }
}
