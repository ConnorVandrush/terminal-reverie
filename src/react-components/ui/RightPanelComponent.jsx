import { useDispatch, useSelector } from "react-redux";

import styles from "./RightPanelComponent.module.css";
import ColorCharacterComponent from "@components/login/ColorCharacterComponent";

export default function RightPanel() {
  const rightPanel = useSelector((state) => state.RightPanelSlice.rightPanel);
  const renderRightPanel = () => {
    switch (rightPanel) {
      case "ColorCharacterComponent":
        return <ColorCharacterComponent />;
    }
  };

  return <div className={styles.rightPanel}>{renderRightPanel()}</div>;
}
