import { useDispatch, useSelector } from "react-redux";
import { setRightPanel } from "@store/ui/rightPanelSlice.js";

import styles from "./CharacterStatusButtonComponent.module.css";

export default function CharacterStatusButtonComponent() {
  const rightPanelState = useSelector(
    (state) => state.RightPanelSlice.rightPanel,
  );
  const dispatch = useDispatch();

  function toggleCharacterStatusComponent() {
    if (rightPanelState === "CharacterStatusComponent") {
      dispatch(setRightPanel(null));
    } else {
      dispatch(setRightPanel("CharacterStatusComponent"));
    }
  }
  return (
    <button
      className={styles.CharacterStatusButton}
      onClick={toggleCharacterStatusComponent}
    />
  );
}
