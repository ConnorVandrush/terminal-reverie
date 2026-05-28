import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./AllyInfo.module.css";

export default function AllyInfo() {
  const dispatch = useDispatch();
  const allies = useSelector((state) => state.encounter.allyInfo);

  const currentTarget = useSelector((state) => state.encounter.currentTarget);

  const handleAllySelect = (index) => {
    const isAlreadySelected =
      currentTarget?.side === "ally" && currentTarget?.index === index;

    if (isAlreadySelected) {
      // Deselect
      dispatch({ type: "encounter/setCurrentTarget", payload: null });
      window.clientGlobalManager.clientEncounterManager.target = null;
    } else {
      // Select
      const payload = { index, side: "ally" };
      dispatch({ type: "encounter/setCurrentTarget", payload });
      window.clientGlobalManager.clientEncounterManager.target = payload;
    }
  };

  return (
    <div className={styles.allyList}>
      {allies.map((ally, index) => {
        const isSelected =
          currentTarget?.side === "ally" && currentTarget?.index === index;

        return (
          <button
            key={index}
            className={`${styles.allyButton} ${isSelected ? styles.selected : ""}`}
            onClick={() => handleAllySelect(index)}
          >
            {ally.name}
            <br />
            HP: {ally.currentHp} / {ally.maxHp}
          </button>
        );
      })}
    </div>
  );
}
