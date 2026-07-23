import { useDispatch, useSelector } from "react-redux";

import styles from "./CenterPanelComponent.module.css";
import SpritesheetDisplayComponent from "@components/login/SpritesheetDisplayComponent";
import PartyWindowComponent from "@components/party/PartyWindowComponent";
import PartyInvitesWindowComponent from "@components/party/PartyInvitesWindowComponent";

export default function CenterPanel() {
  const centerPanel = useSelector(
    (state) => state.CenterPanelSlice.centerPanel,
  );
  const isVisible = !!centerPanel;
  const renderCenterPanel = () => {
    switch (centerPanel) {
      case "SpritesheetDisplayComponent":
        return <SpritesheetDisplayComponent />;
      case "PartyWindowComponent":
        return <PartyWindowComponent />;
      case "PartyInvitesWindowComponent":
        return <PartyInvitesWindowComponent />;
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
