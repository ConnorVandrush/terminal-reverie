import { useSelector } from "react-redux";
import styles from "./EncounterEnemiesComponent.module.css";

export default function EncounterEnemiesComponent() {
  const enemies = useSelector((state) => state.EncounterSlice.enemies);

  return (
    <div className={styles.encounterEnemiesComponentStyle}>
      {enemies.map((enemy, index) =>
        enemy ? (
          <div key={index}>
            <button>{enemy.name}</button>
          </div>
        ) : null,
      )}
    </div>
  );
}
