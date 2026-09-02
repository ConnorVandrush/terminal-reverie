import { useDispatch, useSelector } from "react-redux";

import styles from "./EncounterActionComponent.module.css";
import {
  setSelectedAction,
  setSelectedActionType,
} from "@store/encounter/EncounterSlice";
import { getPlayerCharacterData } from "@store/party/PartySlice";

export default function EncounterActionComponent() {
  const dispatch = useDispatch();

  const characterData = useSelector(getPlayerCharacterData);

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

  if (selectedActionType === null) {
    return (
      <div className={styles.encounterActionComponentStyle}>
        <div className={styles.actionRow}>
          <button onClick={() => handleSelectActionType("Attack")}>
            Attack
          </button>

          <button onClick={() => handleSelectActionType("Defend")}>
            Defend
          </button>
        </div>

        <div className={styles.actionRow}>
          <button onClick={() => handleSelectActionType("Magic")}>Magic</button>

          <button onClick={() => handleSelectActionType("Item")}>Item</button>
        </div>
      </div>
    );
  }

  const actions = {
    Attack: characterData.attacks,
    Defend: characterData.defends,
    Magic: characterData.magics,
    Item: characterData.items,
  }[selectedActionType];

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
