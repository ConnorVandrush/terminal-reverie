import { useDispatch, useSelector } from "react-redux";

import styles from "./PartyButtonComponent.module.css";
import { setCenterPanel } from "@store/ui/CenterPanelSlice.js";

export default function PartyButtonComponent() {
  const dispatch = useDispatch();
  const centerPanelState = useSelector(
    (state) => state.CenterPanelSlice.centerPanel,
  );

  function togglePartyWindow() {
    if (
      window.clientAPI.uiState === "encounter" &&
      centerPanelState === "PartyWindowComponent"
    ) {
      dispatch(setCenterPanel("EncounterWindowComponent"));
    } else if (centerPanelState === "PartyWindowComponent") {
      dispatch(setCenterPanel(null));
    } else {
      dispatch(setCenterPanel("PartyWindowComponent"));
    }
  }

  return (
    <button
      data-testid="partyButton"
      className={styles.chatButton}
      onClick={togglePartyWindow}
    />
  );
}
