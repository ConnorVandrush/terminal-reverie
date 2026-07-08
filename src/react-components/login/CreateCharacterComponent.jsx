import { useSelector, useDispatch } from "react-redux";

import styles from "./CreateCharacterComponent.module.css";

export default function CreateCharacterComponent() {
  return (
    <div className={styles.createCharacterComponentStyle}>
      <div className={styles.title}>
        <h3>Create Character</h3>
      </div>
      <div className={styles.createCharacterForm}>
        <div className={styles.name}>
          <label htmlFor="characterName">Character Name:</label>
          <br />
          <input type="text" id="characterName" />
        </div>
        <div className={styles.origin}>
          <label htmlFor="origin">Origin:</label>
          <br />
          <select id="origin" defaultValue="">
            <option value="" disabled hidden>
              Select...
            </option>
            <option value="plains">Plains</option>
          </select>
        </div>
        <div className={styles.sex}>
          <label htmlFor="sex">Sex:</label>
          <br />
          <select id="sex" defaultValue="">
            <option value="" disabled hidden>
              Select...
            </option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>
        <div className={styles.hair}>
          <label htmlFor="hairStyle">Hair Style:</label>
          <br />
          <select id="hairStyle" defaultValue="">
            <option value="" disabled hidden>
              Select...
            </option>
            <option value="hair1">Style 1</option>
          </select>
        </div>
        <div className={styles.clothing}>
          <label htmlFor="clothingStyle">Clothing Style:</label>
          <br />
          <select id="clothingStyle" defaultValue="">
            <option value="" disabled hidden>
              Select...
            </option>
            <option value="style1">Style 1</option>
          </select>
        </div>
      </div>
    </div>
  );
}
