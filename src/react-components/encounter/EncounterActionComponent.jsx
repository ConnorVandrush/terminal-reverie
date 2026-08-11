import styles from "./EncounterActionComponent.module.css";

export default function EncounterActionComponent() {
  return (
    <div className={styles.encounterActionComponentStyle}>
      <div className={styles.actionRow}>
        <button>Attack</button>
        <button>Defend</button>
      </div>
      <div className={styles.actionRow}>
        <button>Magic</button>
        <button>Item</button>
      </div>
    </div>
  );
}
