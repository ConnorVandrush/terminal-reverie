import { useDispatch, useSelector } from "react-redux";

import styles from "./RightPanelComponent.module.css";
import ColorCharacterComponent from "@components/login/ColorCharacterComponent";
import InventoryComponent from "@components/inventory/InventoryComponent";

export default function RightPanel() {
  const rightPanel = useSelector((state) => state.RightPanelSlice.rightPanel);
  const renderRightPanel = () => {
    switch (rightPanel) {
      case "ColorCharacterComponent":
        return <ColorCharacterComponent />;
      case "InventoryComponent":
        return <InventoryComponent />;
    }
  };

  return <div className={styles.rightPanel}>{renderRightPanel()}</div>;
}
