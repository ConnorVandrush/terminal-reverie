import { useDispatch, useSelector } from "react-redux";

import styles from "./EncounterActionComponent.module.css";
import {
  setSelectedAction,
  setSelectedActionType,
} from "@store/encounter/EncounterSlice";

export default function EncounterActionComponent() {
  const dispatch = useDispatch();

  const characterData = window.clientAPI.playerManager.getPlayerCharacterData();

  const selectedActionType = useSelector(
    (state) => state.EncounterSlice.selectedActionType,
  );

  const selectedAction = useSelector(
    (state) => state.EncounterSlice.selectedAction,
  );

  function handleSelectActionType(actionType) {
    dispatch(setSelectedActionType(actionType));
    dispatch(setSelectedAction(null));
  }

  function handleSelectAction(action) {
    if (selectedAction === action) {
      dispatch(setSelectedAction(null));
      return;
    }

    dispatch(setSelectedAction(action));
  }

  // No action type selected:
  // show Attack / Defend / Magic / Item
  if (selectedActionType === null) {
    return (
      <div className={styles.encounterActionComponentStyle}>
        <div className={styles.actionRow}>
          <button onClick={() => handleSelectActionType("attack")}>
            Attack
          </button>

          <button onClick={() => handleSelectActionType("defend")}>
            Defend
          </button>
        </div>

        <div className={styles.actionRow}>
          <button onClick={() => handleSelectActionType("magic")}>Magic</button>

          <button onClick={() => handleSelectActionType("item")}>Item</button>
        </div>
      </div>
    );
  }

  // Get the appropriate commands for the selected action type
  const actions = {
    attack: characterData.attacks,
    defend: characterData.defends,
    magic: characterData.magics,
    item: characterData.items,
  }[selectedActionType];

  // Safety check for an invalid action type
  if (!actions) {
    return null;
  }

  const rows = [actions.slice(0, 2), actions.slice(2, 4)];

  return (
    <div className={styles.encounterActionComponentStyle}>
      {rows.map((row, rowIndex) => (
        <div className={styles.actionRow} key={rowIndex}>
          {row.map((action) => (
            <button
              key={action}
              className={selectedAction === action ? styles.selected : ""}
              onClick={() => handleSelectAction(action)}
            >
              {action}
            </button>
          ))}

          {row.length < 2 && <div className={styles.emptyAction} />}
        </div>
      ))}
    </div>
  );
}
