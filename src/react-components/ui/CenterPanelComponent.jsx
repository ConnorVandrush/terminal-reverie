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

  const transparencyClass =
    {
      EncounterWindowComponent: styles.transparent,
      PartyWindowComponent: styles.translucent,
      PartyInvitesWindowComponent: styles.translucent,
    }[centerPanel] || "";

  const renderCenterPanel = () =>
    ({
      SpritesheetDisplayComponent: <SpritesheetDisplayComponent />,
      PartyWindowComponent: <PartyWindowComponent />,
      PartyInvitesWindowComponent: <PartyInvitesWindowComponent />,
      EncounterWindowComponent: <EncounterWindowComponent />,
    })[centerPanel] || null;

  return (
    <div
      className={`${styles.centerPanel} ${transparencyClass}`}
      style={{ visibility: isVisible ? "visible" : "hidden" }}
    >
      {renderCenterPanel()}
    </div>
  );
}
