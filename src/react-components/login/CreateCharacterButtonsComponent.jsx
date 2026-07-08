import styles from "./CreateCharacterButtonsComponent.module.css";

export default function CreateCharacterButtonsComponent() {
  return (
    <div className={styles.createCharacterButtonsComponentStyle}>
      <div className={styles.randomizeAppearanceButton}>
        <button type="button" id="randomizeAppearanceButton">
          Randomize Appearance
        </button>
      </div>

      <div className={styles.createCharacterButton}>
        <button type="button" id="createCharacterButton">
          Create Character
        </button>
      </div>
    </div>
  );
}
