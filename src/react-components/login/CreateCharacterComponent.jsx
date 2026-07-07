import { useSelector, useDispatch } from "react-redux";

import styles from "./CreateCharacterComponent.module.css";

export default function CreateCharacterComponent() {
  return (
    <div className={styles.CreateCharacterComponentStyle}>
      <div className={styles.title}>
        <h3>Create Character</h3>
      </div>
      <div>
        <label htmlFor="characterName">Character Name:</label>
        <input type="text" id="characterName" />
      </div>
      <div>
        <label htmlFor="origin">Origin:</label>
        <select id="origin">
          <option value="plains">Plains</option>
        </select>
      </div>
      <div>
        <label htmlFor="gender">Gender:</label>
        <select id="gender">
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
      </div>
      <div>
        <label htmlFor="hairStyle">Hair Style:</label>
        <br />
        <select id="hairStyle">
          <option value="hair1">Style 1</option>
        </select>
      </div>
      <div>
        <label htmlFor="clothingStyle">Clothing Style:</label>
        <br />
        <select id="clothingStyle">
          <option value="style1">Style 1</option>
        </select>
      </div>
    </div>
  );
}
