import { useDispatch, useSelector } from "react-redux";

import styles from "./LeftPanelComponent.module.css";
import LoginComponent from "@components/login/LoginComponent";
import CreateCharacterComponent from "@components/login/CreateCharacterComponent";

export default function LeftPanel() {
  const leftPanel = useSelector((state) => state.LeftPanelSlice.leftPanel);
  const renderLeftPanel = () => {
    switch (leftPanel) {
      case "LoginComponent":
        return <LoginComponent />;
      case "CreateCharacterComponent":
        return <CreateCharacterComponent />;
    }
  };

  return <div className={styles.leftPanel}>{renderLeftPanel()}</div>;
}
