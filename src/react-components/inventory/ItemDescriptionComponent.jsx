import { useSelector, useDispatch } from "react-redux";
import styles from "./ItemDescriptionComponent.module.css";
import { clientUseSelectedItem } from "@store/inventory/InventorySlice";
import { getPlayerCharacterData } from "@store/party/PartySlice";
import { setBottomPanel } from "@store/ui/BottomPanelSlice";

export default function ItemDescriptionComponent() {
  const dispatch = useDispatch();

  const selectedItemId = useSelector(
    (state) => state.InventorySlice.selectedItem,
  );

  const player = useSelector(getPlayerCharacterData);

  const inventory = player?.inventory || {};
  const selectedEntry = selectedItemId ? inventory[selectedItemId] : null;

  if (!selectedEntry) {
    return (
      <div className={styles.ItemDescriptionComponent}>
        <div className={styles.placeholderText}>Select an item</div>
      </div>
    );
  }

  const { qty, itemData } = selectedEntry;

  const hasWeaponTag = itemData?.tags?.includes("weaponTag");
  const hasArmorTag = itemData?.tags?.includes("armorTag");
  const hasConsumableTag = itemData?.tags?.includes("consumableTag");

  function handleUseOrEquip() {
    dispatch(clientUseSelectedItem(selectedItemId));
    dispatch(setBottomPanel(null));
  }

  return (
    <div className={styles.ItemDescriptionComponent}>
      <div className={styles.descriptionDiv}>
        {itemData.description || "No description available."}
      </div>

      <div className={styles.buttonDiv}>
        <div className={styles.actionArea}>
          {hasWeaponTag && (
            <button className={styles.actionButton} onClick={handleUseOrEquip}>
              Equip Weapon
            </button>
          )}

          {hasArmorTag && (
            <button className={styles.actionButton} onClick={handleUseOrEquip}>
              Equip Armor
            </button>
          )}

          {hasConsumableTag && (
            <button className={styles.actionButton} onClick={handleUseOrEquip}>
              Use Item
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
