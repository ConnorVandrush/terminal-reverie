import { useDispatch, useSelector } from "react-redux";

import styles from "./CenterPanelComponent.module.css";
import SpritesheetDisplayComponent from "@components/login/SpritesheetDisplayComponent";
import PartyWindowComponent from "@components/party/PartyWindowComponent";
import PartyInvitesWindowComponent from "@components/party/PartyInvitesWindowComponent";
import EncounterWindowComponent from "@components/encounter/EncounterWindowComponent";

export default function CenterPanel() {
  const centerPanel = useSelector(
    (state) => state.CenterPanelSlice.centerPanel,
  );

  const isVisible = !!centerPanel;

  const transparencyClass = (() => {
    switch (centerPanel) {
      case "EncounterWindowComponent":
        return styles.transparent;

      case "PartyWindowComponent":
      case "PartyInvitesWindowComponent":
        return styles.translucent;

      default:
        return ""; // default opaque background
    }
  })();

  const renderCenterPanel = () => {
    switch (centerPanel) {
      case "SpritesheetDisplayComponent":
        return <SpritesheetDisplayComponent />;
      case "PartyWindowComponent":
        return <PartyWindowComponent />;
      case "PartyInvitesWindowComponent":
        return <PartyInvitesWindowComponent />;
      case "EncounterWindowComponent":
        return <EncounterWindowComponent />;
    }
  };

  return (
    <div
      className={`${styles.centerPanel} ${transparencyClass}`}
      style={{ visibility: isVisible ? "visible" : "hidden" }}
    >
      {renderCenterPanel()}
    </div>
  );
}
