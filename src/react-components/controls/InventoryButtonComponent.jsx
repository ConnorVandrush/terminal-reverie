import { useDispatch, useSelector } from "react-redux";
import { setRightPanel } from "@store/ui/rightPanelSlice.js";

import styles from "./InventoryButtonComponent.module.css";

export default function InventoryButtonComponent() {
  const rightPanelState = useSelector(
    (state) => state.RightPanelSlice.rightPanel,
  );
  const dispatch = useDispatch();

  function toggleInventoryComponent() {
    if (rightPanelState === "InventoryComponent") {
      dispatch(setRightPanel(null));
    } else {
      dispatch(setRightPanel("InventoryComponent"));
    }
  }
  return (
    <button
      className={styles.inventoryButton}
      onClick={toggleInventoryComponent}
    />
  );
}
