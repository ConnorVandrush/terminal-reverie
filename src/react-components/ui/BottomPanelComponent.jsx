import { useDispatch, useSelector } from "react-redux";

import styles from "./BottomPanelComponent.module.css";
import CreateCharacterButtonsComponent from "@components/login/CreateCharacterButtonsComponent";

export default function BottomPanel() {
  const bottomPanel = useSelector(
    (state) => state.BottomPanelSlice.bottomPanel,
  );
  const isVisible = !!bottomPanel;
  const renderBottomPanel = () => {
    switch (bottomPanel) {
      case "CreateCharacterButtonsComponent":
        return <CreateCharacterButtonsComponent />;
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
