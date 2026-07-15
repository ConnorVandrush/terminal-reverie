import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./ColorCharacterComponent.module.css";
import {
  setCharacterSpriteDesign,
  setCharacterSpritePreview,
} from "@store/party/PartySlice";

export default function ColorCharacterComponent() {
  const dispatch = useDispatch();

  const characterSpriteDesign = useSelector(
    (state) => state.PartySlice.characterSpriteDesign,
  );

  useEffect(() => {
    async function updateSpritePreview() {
      const { origin, sex, hairStyle, clothingStyle } = characterSpriteDesign;

      const sprite = await window.clientAPI.spriteManager.designCharacterSprite(
        "/img/characters/$characterSpritesheet.png",
      );

      dispatch(setCharacterSpritePreview(sprite));
    }

    updateSpritePreview();
  }, [characterSpriteDesign, dispatch]);

  return (
    <div className={styles.colorCharacterComponentStyle}>
      {/* Hair */}
      <div className={styles.hair}>
        <label htmlFor="hairColor">Hair Color:</label>
        <select
          id="hairColor"
          value={characterSpriteDesign.hairColor || ""}
          onChange={(e) =>
            dispatch(
              setCharacterSpriteDesign({
                ...characterSpriteDesign,
                hairColor: e.target.value,
              }),
            )
          }
        >
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

      {/* Eyes */}
      <div className={styles.eye}>
        <label htmlFor="eyeColor">Eye Color:</label>
        <select
          id="eyeColor"
          value={characterSpriteDesign.eyeColor || ""}
          onChange={(e) =>
            dispatch(
              setCharacterSpriteDesign({
                ...characterSpriteDesign,
                eyeColor: e.target.value,
              }),
            )
          }
        >
          <option value="" disabled hidden>
            Select...
          </option>
          <option value="blueEyes">Blue</option>
          <option value="brownEyes">Brown</option>
          <option value="darkBrownEyes">Dark Brown</option>
          <option value="greenEyes">Green</option>
        </select>
      </div>

      {/* Skin */}
      <div className={styles.skin}>
        <label htmlFor="skinTone">Skin Tone:</label>
        <select
          id="skinTone"
          value={characterSpriteDesign.skinTone || ""}
          onChange={(e) =>
            dispatch(
              setCharacterSpriteDesign({
                ...characterSpriteDesign,
                skinTone: e.target.value,
              }),
            )
          }
        >
          <option value="" disabled hidden>
            Select...
          </option>
          <option value="fairSkin">Fair</option>
          <option value="richSkin">Rich</option>
          <option value="rosySkin">Rosy</option>
          <option value="tanSkin">Tan</option>
        </select>
      </div>

      {/* Clothing */}
      <div className={styles.clothing}>
        <label htmlFor="clothingColor">Clothing Color:</label>
        <select
          id="clothingColor"
          value={characterSpriteDesign.clothingColor || ""}
          onChange={(e) =>
            dispatch(
              setCharacterSpriteDesign({
                ...characterSpriteDesign,
                clothingColor: e.target.value,
              }),
            )
          }
        >
          <option value="" disabled hidden>
            Select...
          </option>
          <option value="blueClothing">Blue</option>
          <option value="greenClothing">Green</option>
          <option value="redClothing">Red</option>
        </select>
      </div>
    </div>
  );
}
