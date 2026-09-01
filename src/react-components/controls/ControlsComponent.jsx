import styles from "./ControlsComponent.module.css";

import MovementButtonComponent from "./MovementButtonComponent";
import ChatButtonComponent from "./ChatButtonComponent";
import ConirmButtonComponent from "./ConfirmButtonComponent";
import CancelButtonComponent from "./CancelButtonComponent";
import PartyButtonComponent from "./PartyButtonComponent";
import TradeButtonComponent from "./TradeButtonComponent";
import InventoryButtonComponent from "./InventoryButtonComponent";
import CharacterStatusButtonComponent from "./CharacterStatusButtonComponent";

export default function ControlsComponent() {
  return (
    <div className={styles.controlsComponentStyle}>
      <CharacterStatusButtonComponent />
      <InventoryButtonComponent />
      <MovementButtonComponent direction="Up" />
      <MovementButtonComponent direction="Left" />
      <MovementButtonComponent direction="Right" />
      <MovementButtonComponent direction="Down" />
      <ConirmButtonComponent />
      <CancelButtonComponent />
      <ChatButtonComponent />
      <PartyButtonComponent />
      <TradeButtonComponent />
    </div>
  );
}
