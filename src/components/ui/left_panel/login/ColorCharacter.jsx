import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./ColorCharacter.module.css";
import {
  setHairColor,
  recolorSprite,
  setEyeColor,
  setSkinColor,
  setShirtColor,
  setPantsColor,
  setCreateCharacterCB,
} from "@store/createCharacterSlice";

export default function ColorCharacter() {
  const dispatch = useDispatch();

  const name = useSelector((state) => state.createCharacter.name);
  const origin = useSelector((state) => state.createCharacter.origin);
  const job = useSelector((state) => state.createCharacter.job);
  const gender = useSelector((state) => state.createCharacter.gender);
  const hairStyle = useSelector((state) => state.createCharacter.hairStyle);
  const clothingStyle = useSelector(
    (state) => state.createCharacter.clothingStyle,
  );
  const hairColor = useSelector((state) => state.createCharacter.hairColor);
  const eyeColor = useSelector((state) => state.createCharacter.eyeColor);
  const skinColor = useSelector((state) => state.createCharacter.skinColor);
  const shirtColor = useSelector((state) => state.createCharacter.shirtColor);
  const pantsColor = useSelector((state) => state.createCharacter.pantsColor);
  const createCharacterCB = useSelector(
    (state) => state.createCharacter.createCharacterCB,
  );
  const template = origin + job + gender + hairStyle + clothingStyle;

  const HAIR_COLORS = [
    "blondeHair",
    "blackHair",
    "brownHair",
    "redHair",
    "greyHair",
  ];
  const EYE_COLORS = ["blueEyes", "darkBrownEyes", "brownEyes", "greenEyes"];
  const SKIN_COLORS = ["rosySkin", "richSkin", "tanSkin", "fairSkin"];
  const SHIRT_COLORS = ["greenShirt", "redShirt", "blueShirt"];
  const PANTS_COLORS = ["greenPants", "redPants", "bluePants"];

  const handleCreateCharacter = () => {
    if (createCharacterCB) {
      const appearance = {
        template: template,
        colors: {
          hair: hairColor,
          eyes: eyeColor,
          skin: skinColor,
          shirt: shirtColor,
          pants: pantsColor,
        },
      };

      createCharacterCB({ success: true, appearance: appearance, name: name });
      dispatch(setCreateCharacterCB(null)); // Clear the callback after use
    }
  };

  const handleRecolorSprite = (e) => {
    let option;
    switch (e.target.name) {
      case "hairColor":
        dispatch(setHairColor(e.target.value));
        option = "hair";
        break;
      case "eyeColor":
        dispatch(setEyeColor(e.target.value));
        option = "eyes";
        break;
      case "skinColor":
        dispatch(setSkinColor(e.target.value));
        option = "skin";
        break;
      case "shirtColor":
        dispatch(setShirtColor(e.target.value));
        option = "shirt";
        break;
      case "pantsColor":
        dispatch(setPantsColor(e.target.value));
        option = "pants";
        break;
      default:
        break;
    }
    dispatch(recolorSprite(option));
  };

  const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const handleRandomizeAppearance = async () => {
    const newHair = randomFrom(HAIR_COLORS);
    const newEyes = randomFrom(EYE_COLORS);
    const newSkin = randomFrom(SKIN_COLORS);
    const newShirt = randomFrom(SHIRT_COLORS);
    const newPants = randomFrom(PANTS_COLORS);

    dispatch(setHairColor(newHair));
    dispatch(setEyeColor(newEyes));
    dispatch(setSkinColor(newSkin));
    dispatch(setShirtColor(newShirt));
    dispatch(setPantsColor(newPants));

    await dispatch(recolorSprite("hair"));
    await dispatch(recolorSprite("eyes"));
    await dispatch(recolorSprite("skin"));
    await dispatch(recolorSprite("shirt"));
    await dispatch(recolorSprite("pants"));
  };

  useEffect(() => {
    handleRandomizeAppearance();
  }, []);

  return (
    <div className={styles.colorCharacter}>
      <div className={styles.colorCharacterForm}>
        <div>
          <label htmlFor="hairColor">Hair Color:</label>
          <select
            id="hairColor"
            name="hairColor"
            value={hairColor}
            className={styles.input}
            onChange={handleRecolorSprite}
          >
            <option value="blackHair">Black</option>
            <option value="blondeHair">Blonde</option>
            <option value="brownHair">Brown</option>
            <option value="greyHair">Grey</option>
            <option value="redHair">Red</option>
          </select>
        </div>

        <div>
          <label htmlFor="eyeColor">Eye Color:</label>
          <select
            id="eyeColor"
            name="eyeColor"
            value={eyeColor}
            className={styles.input}
            onChange={handleRecolorSprite}
          >
            <option value="blueEyes">Blue</option>
            <option value="brownEyes">Brown</option>
            <option value="darkBrownEyes">Dark Brown</option>
            <option value="greenEyes">Green</option>
          </select>
        </div>

        <div>
          <label htmlFor="skinColor">Skin Tone:</label>
          <select
            id="skinColor"
            name="skinColor"
            value={skinColor}
            className={styles.input}
            onChange={handleRecolorSprite}
          >
            <option value="fairSkin">Fair</option>
            <option value="richSkin">Rich</option>
            <option value="rosySkin">Rosy</option>
            <option value="tanSkin">Tan</option>
          </select>
        </div>

        <div>
          <label htmlFor="shirtColor">Shirt Color:</label>
          <select
            id="shirtColor"
            name="shirtColor"
            value={shirtColor}
            className={styles.input}
            onChange={handleRecolorSprite}
          >
            <option value="blueShirt">Blue</option>
            <option value="greenShirt">Green</option>
            <option value="redShirt">Red</option>
          </select>
        </div>

        <div>
          <label htmlFor="pantsColor">Pants Color:</label>
          <select
            id="pantsColor"
            name="pantsColor"
            value={pantsColor}
            className={styles.input}
            onChange={handleRecolorSprite}
          >
            <option value="bluePants">Blue</option>
            <option value="greenPants">Green</option>
            <option value="redPants">Red</option>
          </select>
        </div>

        <button
          type="button"
          id="createCharacterButton"
          onClick={handleRandomizeAppearance}
        >
          Randomize Appearance
        </button>

        <button
          type="button"
          id="createCharacterButton"
          onClick={handleCreateCharacter}
        >
          Create Character
        </button>
      </div>
    </div>
  );
}
