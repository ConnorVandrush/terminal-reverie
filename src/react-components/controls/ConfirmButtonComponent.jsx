import React from "react";
import { useSelector, useDispatch } from "react-redux";

import styles from "./ConfirmButtonComponent.module.css";

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
    const encounterActionMap = {
      Strike: "Strike",
      Flee: "Flee",
      Focus: "Focus",
      Equip: "Equip",
    };

    const payload = {
      targetId: enemies[selectedEncounterTarget.index].enemyInstanceId,
      action: encounterActionMap[selectedEncounterAction],
    };
    if (payload) {
      window.clientAPI.dispatchToReact({
        type: "EncounterSlice/clientSubmitEncounterAction",
        payload,
      });
    }
    window.clientAPI.dispatchToReact({
      type: "BottomPanelSlice/setBottomPanel",
      payload: "EncounterReadOutComponent",
    });

    Input.virtualClick("ok");
  }

  return <button className={styles.confirmationButton} onClick={confirm} />;
}
