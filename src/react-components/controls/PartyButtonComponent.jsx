import { useDispatch, useSelector } from "react-redux";
import { setCenterPanel } from "@store/ui/CenterPanelSlice.js";

import styles from "./PartyButtonComponent.module.css";

export default function PartyButtonComponent() {
  const dispatch = useDispatch();
  const centerPanelState = useSelector(
    (state) => state.CenterPanelSlice.centerPanel,
  );

  function togglePartyWindow() {
    if (centerPanelState === "PartyWindowComponent") {
      dispatch(setCenterPanel(null));
    } else {
      dispatch(setCenterPanel("PartyWindowComponent"));
    }
  }

  return (
    <button
      data-testid="invite-to-party-button"
      className={styles.chatButton}
      onClick={togglePartyWindow}
    />
  );
}
