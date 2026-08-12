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

  function confirm() {
    Input.virtualClick("ok");

    if (selectedEncounterAction === "attack") {
    }
  }
  return <button className={styles.confirmationButton} onClick={confirm} />;
}
