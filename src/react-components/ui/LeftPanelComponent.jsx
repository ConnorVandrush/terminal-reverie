import { useDispatch, useSelector } from "react-redux";

import styles from "./LeftPanelComponent.module.css";
import LoginComponent from "../login/LoginComponent";

export default function LeftPanel() {
  const leftPanel = useSelector((state) => state.LeftPanelSlice.leftPanel);
  const renderLeftPanel = () => {
    switch (leftPanel) {
      case "LoginComponent":
        return <LoginComponent />;
    }
  };

  return <div className={styles.leftPanel}>{renderLeftPanel()}</div>;
}
