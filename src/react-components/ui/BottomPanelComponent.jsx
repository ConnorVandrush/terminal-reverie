import { useDispatch, useSelector } from "react-redux";

import styles from "./BottomPanelComponent.module.css";
import CreateCharacterButtonsComponent from "@components/login/CreateCharacterButtonsComponent";
import ChatWindowComponent from "@components/chat/ChatWindowComponent";

export default function BottomPanel() {
  const bottomPanel = useSelector(
    (state) => state.BottomPanelSlice.bottomPanel,
  );
  const isVisible = !!bottomPanel;
  const renderBottomPanel = () => {
    switch (bottomPanel) {
      case "CreateCharacterButtonsComponent":
        return <CreateCharacterButtonsComponent />;
      case "ChatWindowComponent":
        return <ChatWindowComponent />;
    }
  };

  return (
    <div
      className={styles.bottomPanel}
      style={{ visibility: isVisible ? "visible" : "hidden" }}
    >
      {renderBottomPanel()}
    </div>
  );
}
