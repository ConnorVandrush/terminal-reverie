import { useSelector, useDispatch } from "react-redux";

import styles from "./InventoryComponent.module.css";
import { getPlayerCharacterData } from "@store/party/PartySlice";
import { setSelectedItem } from "@store/inventory/InventorySlice";
import { setBottomPanel } from "@store/ui/BottomPanelSlice";
import { setCenterPanel } from "@store/ui/CenterPanelSlice";

export default function InventoryComponent() {
  const dispatch = useDispatch();

  const player = useSelector(getPlayerCharacterData);
  const inventory = player?.inventory || {};

  const selectedItem = useSelector(
    (state) => state.InventorySlice.selectedItem,
  );

  const bottomPanelState = useSelector(
    (state) => state.BottomPanelSlice.bottomPanel,
  );

  const centerPanelState = useSelector(
    (state) => state.CenterPanelSlice.centerPanel,
  );

  const entries = Object.entries(inventory);

  function handleSelect(itemId) {
    const isSelected = selectedItem === itemId;

    if (isSelected) {
      // Deselect item
      dispatch(setSelectedItem(null));

      // Close bottom panel if it's showing the item description
      if (bottomPanelState === "ItemDescriptionComponent") {
        dispatch(setBottomPanel(null));
      }
      if (centerPanelState === "PartyWindowComponent") {
        dispatch(setCenterPanel(null));
      }
      return;
    }

    // Select new item
    dispatch(setSelectedItem(itemId));

    // Open item description panel
    dispatch(setBottomPanel("ItemDescriptionComponent"));
    dispatch(setCenterPanel("PartyWindowComponent"));
  }

  return (
    <div className={styles.InventoryComponent}>
      <h3>Inventory</h3>

      <div className={styles.scrollArea}>
        {entries.map(([itemId, { qty, itemData }]) => (
          <button
            key={itemId}
            className={`${styles.itemButton} ${
              selectedItem === itemId ? styles.selected : ""
            }`}
            onClick={() => handleSelect(itemId)}
          >
            {itemData.name} x{qty}
          </button>
        ))}
      </div>
    </div>
  );
}
