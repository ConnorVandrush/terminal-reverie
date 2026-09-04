import { useDispatch, useSelector } from "react-redux";

import styles from "./SelectedShopItemComponent.module.css";

import { getPlayerCharacterData } from "@store/party/PartySlice";
import { clientBuyOrSellItem } from "@store/shop/ShopSlice";

export default function SelectedShopItemComponent() {
  const dispatch = useDispatch();

  const selectedShopItem = useSelector(
    (state) => state.ShopSlice.selectedShopItem,
  );

  const shopInventory = useSelector((state) => state.ShopSlice.shopInventory);

  const playerInventory = useSelector(
    (state) => getPlayerCharacterData(state).inventory,
  );

  if (!selectedShopItem) {
    return null;
  }

  const { itemId, action } = selectedShopItem;

  const itemData =
    action === "buy"
      ? shopInventory[itemId]
      : playerInventory[itemId]?.itemData;

  if (!itemData) {
    return null;
  }

  function handleBuyOrSell() {
    dispatch(
      clientBuyOrSellItem({
        itemId: itemData.id,
        action,
      }),
    );
  }

  return (
    <div className={styles.SelectedShopItemComponent}>
      <div className={styles.descriptionDiv}>
        {itemData.description || "No description available."}
      </div>

      <div className={styles.buttonDiv}>
        <button onClick={handleBuyOrSell}>
          {action === "buy" ? "Buy" : "Sell"}
        </button>
      </div>
    </div>
  );
}
