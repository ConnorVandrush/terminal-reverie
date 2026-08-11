import { useDispatch, useSelector } from "react-redux";

import styles from "./LeftPanelComponent.module.css";
import LoginComponent from "@components/login/LoginComponent";
import CreateCharacterComponent from "@components/login/CreateCharacterComponent";
import ControlsComponent from "@components/controls/ControlsComponent";
import EncounterEnemiesComponent from "@components/encounter/EncounterEnemiesComponent";

export default function LeftPanel() {
  const leftPanel = useSelector((state) => state.LeftPanelSlice.leftPanel);
  const renderLeftPanel = () => {
    switch (leftPanel) {
      case "LoginComponent":
        return <LoginComponent />;
      case "CreateCharacterComponent":
        return <CreateCharacterComponent />;
      case "Controls":
        return <ControlsComponent />;
      case "EncounterEnemiesComponent":
        return <EncounterEnemiesComponent />;
    }
  };

  return <div className={styles.leftPanel}>{renderLeftPanel()}</div>;
}
