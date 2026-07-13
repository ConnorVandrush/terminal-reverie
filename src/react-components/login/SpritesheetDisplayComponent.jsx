import { useSelector } from "react-redux";
import styles from "./SpritesheetDisplayComponent.module.css";

export default function SpritesheetDisplay() {
  const characterSpritePreview = useSelector(
    (state) => state.PartySlice.characterSpritePreview,
  );

  if (!characterSpritePreview) {
    return null;
  }

  return (
    <div className={styles.spritesheetDisplayComponentStyle}>
      <img
        src={characterSpritePreview}
        alt="Spritesheet"
        className={styles.spritesheetImage}
      />
    </div>
  );
}
