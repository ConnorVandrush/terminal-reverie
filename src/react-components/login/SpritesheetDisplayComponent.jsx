import styles from "./SpritesheetDisplayComponent.module.css";

export default function SpritesheetDisplay() {
  return (
    <img
      src={"/img/characters/$grasslandswarriormalehair1style1.png"}
      alt="Spritesheet"
      className={styles.spritesheetImage}
    />
  );
}
