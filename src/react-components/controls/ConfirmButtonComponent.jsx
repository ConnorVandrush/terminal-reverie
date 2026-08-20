import { useSelector, useDispatch } from "react-redux";

import styles from "./ConfirmButtonComponent.module.css";

import { setBottomPanel } from "@store/ui/BottomPanelSlice";
import { clientSubmitEncounterAction } from "@store/encounter/EncounterSlice";

export default function ConirmButtonComponent() {
  const dispatch = useDispatch();

  const selectedEncounterAction = useSelector(
    (state) => state.EncounterSlice.selectedAction,
  );
  const selectedEncounterTarget = useSelector(
    (state) => state.EncounterSlice.target,
  );
  const enemies = useSelector((state) => state.EncounterSlice.enemies);

  function confirm() {
    if (selectedEncounterAction && selectedEncounterTarget) {
      const payload = {
        targetId: enemies[selectedEncounterTarget.index].enemyInstanceId,
        action: selectedEncounterAction,
      };
      dispatch(clientSubmitEncounterAction(payload));
      dispatch(setBottomPanel("EncounterMessageComponent"));
    }

    Input.virtualClick("ok");
  }

  return <button className={styles.confirmationButton} onClick={confirm} />;
}
