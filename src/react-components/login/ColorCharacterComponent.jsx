import styles from "./colorCharacterComponent.module.css";

export default function ColorCharacterComponent() {
  return (
    <div className={styles.colorCharacterComponentStyle}>
      <div className={styles.hair}>
        <label htmlFor="hairColor">Hair Color:</label>
        <select id="hairColor" defaultValue="">
          <option value="" disabled hidden>
            Select...
          </option>
          <option value="blackHair">Black</option>
          <option value="blondeHair">Blonde</option>
          <option value="brownHair">Brown</option>
          <option value="greyHair">Grey</option>
          <option value="redHair">Red</option>
        </select>
      </div>

      <div className={styles.eye}>
        <label htmlFor="eyeColor">Eye Color:</label>
        <select id="eyeColor" defaultValue="">
          <option value="" disabled hidden>
            Select...
          </option>
          <option value="blueEyes">Blue</option>
          <option value="brownEyes">Brown</option>
          <option value="darkBrownEyes">Dark Brown</option>
          <option value="greenEyes">Green</option>
        </select>
      </div>

      <div className={styles.skin}>
        <label htmlFor="skinColor">Skin Tone:</label>
        <select id="skinColor" defaultValue="">
          <option value="" disabled hidden>
            Select...
          </option>
          <option value="fairSkin">Fair</option>
          <option value="richSkin">Rich</option>
          <option value="rosySkin">Rosy</option>
          <option value="tanSkin">Tan</option>
        </select>
      </div>

      <div className={styles.shirt}>
        <label htmlFor="shirtColor">Shirt Color:</label>
        <select id="shirtColor" defaultValue="">
          <option value="" disabled hidden>
            Select...
          </option>
          <option value="blueShirt">Blue</option>
          <option value="greenShirt">Green</option>
          <option value="redShirt">Red</option>
        </select>
      </div>

      <div className={styles.pants}>
        <label htmlFor="pantsColor">Pants Color:</label>
        <select id="pantsColor" defaultValue="">
          <option value="" disabled hidden>
            Select...
          </option>
          <option value="bluePants">Blue</option>
          <option value="greenPants">Green</option>
          <option value="redPants">Red</option>
        </select>
      </div>
    </div>
  );
}
