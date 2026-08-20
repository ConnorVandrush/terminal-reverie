import { useDispatch, useSelector } from "react-redux";

import styles from "./BottomPanelComponent.module.css";
import CreateCharacterButtonsComponent from "@components/login/CreateCharacterButtonsComponent";
import ChatWindowComponent from "@components/chat/ChatWindowComponent";
import EncounterActionComponent from "@components/encounter/EncounterActionComponent";
import EncounterMessageComponent from "@components/encounter/EncounterMessageComponent";

export default function BottomPanel() {
  const bottomPanel = useSelector(
    (state) => state.BottomPanelSlice.bottomPanel,
  );
  const isVisible = !!bottomPanel;
  const renderBottomPanel = () =>
    ({
      CreateCharacterButtonsComponent: <CreateCharacterButtonsComponent />,
      ChatWindowComponent: <ChatWindowComponent />,
      EncounterActionComponent: <EncounterActionComponent />,
      EncounterMessageComponent: <EncounterMessageComponent />,
    })[bottomPanel] || null;

  return (
    <div
      className={styles.bottomPanel}
      style={{ visibility: isVisible ? "visible" : "hidden" }}
    >
      {renderBottomPanel()}
    </div>
  );
}
