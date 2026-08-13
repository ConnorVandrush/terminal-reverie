import { useDispatch, useSelector } from "react-redux";

import styles from "./RightPanelComponent.module.css";
import ColorCharacterComponent from "@components/login/ColorCharacterComponent";
import InventoryComponent from "@components/inventory/InventoryComponent";
import EncounterTurnOrderComponent from "@components/encounter/EncounterTurnOrderComponent";

export default function RightPanel() {
  const rightPanel = useSelector((state) => state.RightPanelSlice.rightPanel);
  const renderRightPanel = () =>
    ({
      ColorCharacterComponent: <ColorCharacterComponent />,
      InventoryComponent: <InventoryComponent />,
      EncounterTurnOrderComponent: <EncounterTurnOrderComponent />,
    })[rightPanel] || null;

  return <div className={styles.rightPanel}>{renderRightPanel()}</div>;
}
