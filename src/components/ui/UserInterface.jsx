import React from "react";

import styles from "./UserInterface.module.css";
import MovementButton from "./left_panel/bottom_9/MovementButton";
import ConirmButton from "./left_panel/bottom_9/ConfirmButton";
import CancelButton from "./left_panel/bottom_9/CancelButton";
import ChatButton from "./left_panel/bottom_9/ChatButton";
import PartyButton from "./left_panel/bottom_9/PartyButton";
import TradeButton from "./left_panel/bottom_9/TradeButton";
import StatsButton from "./left_panel/top_9/StatsButton";
import InventoryButton from "./left_panel/top_9/inventoryButton";

export default function UserInterface() {
  return (
    <div className={styles.userInterface}>
      <div className={styles.top9}>
        <StatsButton />
        <InventoryButton />
      </div>

      <div className={styles.bottom9}>
        <MovementButton direction="Up" />
        <MovementButton direction="Down" />
        <MovementButton direction="Left" />
        <MovementButton direction="Right" />
        <ConirmButton />
        <CancelButton />
        <ChatButton />
        <PartyButton />
        <TradeButton />
      </div>
    </div>
  );
}
