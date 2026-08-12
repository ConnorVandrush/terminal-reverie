import { useSelector, useDispatch } from "react-redux";
import styles from "./EncounterEnemiesComponent.module.css";
import { setTarget } from "@store/encounter/EncounterSlice";

export default function EncounterEnemiesComponent() {
  const dispatch = useDispatch();
  const enemies = useSelector((state) => state.EncounterSlice.enemies);
  const currentTarget = useSelector((state) => state.EncounterSlice.target);

  function handleSelectTarget(index) {
    if (currentTarget?.side === "enemy" && currentTarget?.index === index) {
      dispatch(setTarget(null));
      return;
    }
    dispatch(setTarget({ side: "enemy", index: index }));
  }

  return (
    <div className={styles.encounterEnemiesComponentStyle}>
      {enemies.map((enemy, index) =>
        enemy ? (
          <div key={index}>
            <button
              className={
                currentTarget?.side === "enemy" &&
                currentTarget?.index === index
                  ? styles.selected
                  : ""
              }
              onClick={() => handleSelectTarget(index)}
            >
              {enemy.name}
            </button>
          </div>
        ) : null,
      )}
    </div>
  );
}
