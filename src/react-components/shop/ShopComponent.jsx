import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import styles from "./ShopComponent.module.css";
import { getPlayerCharacterData } from "@store/party/PartySlice";
import { setCenterPanel } from "@store/ui/CenterPanelSlice";
import { setBottomPanel } from "@store/ui/BottomPanelSlice";
import { setSelectedShopItem } from "@store/shop/ShopSlice";

export default function ShopComponent() {
  const dispatch = useDispatch();

  const shopInventory = Object.entries(
    useSelector((state) => state.ShopSlice.shopInventory),
  );

  const playerInventory = Object.entries(
    useSelector(getPlayerCharacterData).inventory,
  );

  const selectedShopItem = useSelector(
    (state) => state.ShopSlice.selectedShopItem,
  );

  function handleSelect(itemId, action) {
    const isSelected =
      selectedShopItem?.itemId === itemId &&
      selectedShopItem?.action === action;

    if (isSelected) {
      dispatch(setSelectedShopItem(null));
      dispatch(setBottomPanel(null));
      return;
    }

    dispatch(
      setSelectedShopItem({
        itemId,
        action,
      }),
    );

    dispatch(setBottomPanel("SelectedShopItemComponent"));
  }

  useEffect(() => {
    return () => {
      // Runs when ShopComponent is unmounted
      dispatch(setSelectedShopItem(null));
    };
  }, [dispatch]);

  return (
    <div className={styles.ShopComponent}>
      <div className={styles.ShopHeader}>Item Shop</div>

      <div className={styles.Inventories}>
        <div className={styles.ShopInventory}>
          <span className={styles.Title}>Buy</span>

          {shopInventory.map(([itemId, itemData]) => (
            <button
              key={itemId}
              className={`${styles.itemButton} ${
                selectedShopItem?.itemId === itemId &&
                selectedShopItem?.action === "buy"
                  ? styles.selected
                  : ""
              }`}
              onClick={() => handleSelect(itemId, "buy")}
            >
              {itemData.name} — {itemData.cost}M
            </button>
          ))}
        </div>

        <div className={styles.PlayerInventory}>
          <span className={styles.Title}>Sell</span>

          {playerInventory.map(([itemId, { qty, itemData }]) => (
            <button
              key={itemId}
              className={`${styles.itemButton} ${
                selectedShopItem?.itemId === itemId &&
                selectedShopItem?.action === "sell"
                  ? styles.selected
                  : ""
              }`}
              onClick={() => handleSelect(itemId, "sell")}
            >
              {itemData.name} x{qty}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
