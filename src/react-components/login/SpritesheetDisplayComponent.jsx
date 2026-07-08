import styles from "./SpritesheetDisplayComponent.module.css";

export default function SpritesheetDisplay() {
  return (
    <div className={styles.spritesheetDisplayComponentStyle}>
      <img
        src={"/img/characters/$grasslandswarriormalehair1style1.png"}
        alt="Spritesheet"
        className={styles.spritesheetImage}
      />
    </div>
  );
}
