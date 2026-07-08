import { useDispatch, useSelector } from "react-redux";

import styles from "./CenterPanelComponent.module.css";
import SpritesheetDisplayComponent from "@components/login/SpritesheetDisplayComponent";

export default function CenterPanel() {
  const centerPanel = useSelector(
    (state) => state.CenterPanelSlice.centerPanel,
  );
  const isVisible = !!centerPanel;
  const renderCenterPanel = () => {
    switch (centerPanel) {
      case "SpritesheetDisplayComponent":
        return <SpritesheetDisplayComponent />;
    }
  };

  return (
    <div
      className={styles.centerPanel}
      style={{ visibility: isVisible ? "visible" : "hidden" }}
    >
      {renderCenterPanel()}
    </div>
  );
}
