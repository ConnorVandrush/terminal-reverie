import { useDispatch, useSelector } from "react-redux";

import styles from "./CancelButtonComponent.module.css";
import { setSelectedActionType } from "@store/encounter/EncounterSlice";

import { setBottomPanel } from "@store/ui/BottomPanelSlice";

export default function CancelButtonComponent() {
  const dispatch = useDispatch();

  const selectedActionType = useSelector(
    (state) => state.EncounterSlice.selectedActionType,
  );

  function cancel() {
    if (
      window.clientAPI.uiState === "encounter" &&
      selectedActionType !== null
    ) {
      dispatch(setBottomPanel("EncounterActionComponent"));
      dispatch(setSelectedActionType(null));
      return;
    }

    Input.virtualClick("cancel");
  }

  return (
    <button
      data-testid="cancel-button"
      className={styles.cancelButton}
      onClick={cancel}
    />
  );
}
