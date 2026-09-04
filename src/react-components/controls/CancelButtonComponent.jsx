import { useDispatch, useSelector } from "react-redux";

import styles from "./CancelButtonComponent.module.css";
import { setSelectedActionType } from "@store/encounter/EncounterSlice";

import { setBottomPanel } from "@store/ui/BottomPanelSlice";
import { setCenterPanel } from "@store/ui/CenterPanelSlice";

export default function CancelButtonComponent() {
  const dispatch = useDispatch();

  const selectedActionType = useSelector(
    (state) => state.EncounterSlice.selectedActionType,
  );
  const centerPanelState = useSelector(
    (state) => state.CenterPanelSlice.centerPanel,
  );
  const bottomPanelState = useSelector(
    (state) => state.BottomPanelSlice.bottomPanel,
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
    if (centerPanelState === "ShopComponent") {
      dispatch(setCenterPanel(null));
      if (bottomPanelState === "SelectedShopItemComponent") {
        dispatch(setBottomPanel(null));
      }
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
