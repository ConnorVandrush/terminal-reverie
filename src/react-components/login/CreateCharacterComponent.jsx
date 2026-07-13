import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./CreateCharacterComponent.module.css";
import {
  setCharacterSpriteDesign,
  setCharacterSpritePreview,
} from "@store/party/PartySlice";

export default function CreateCharacterComponent() {
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
          <select
            id="origin"
            defaultValue=""
            onChange={(e) =>
              dispatch(
                setCharacterSpriteDesign({
                  ...characterSpriteDesign,
                  origin: e.target.value,
                }),
              )
            }
          >
            <option value="" disabled hidden>
              Select...
            </option>
            <option value="Plains">Plains</option>
          </select>
        </div>

        <div className={styles.sex}>
          <label htmlFor="sex">Sex:</label>
          <br />
          <select
            id="sex"
            defaultValue=""
            onChange={(e) =>
              dispatch(
                setCharacterSpriteDesign({
                  ...characterSpriteDesign,
                  sex: e.target.value,
                }),
              )
            }
          >
            <option value="" disabled hidden>
              Select...
            </option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>
        </div>

        <div className={styles.hair}>
          <label htmlFor="hairStyle">Hair Style:</label>
          <br />
          <select
            id="hairStyle"
            defaultValue=""
            onChange={(e) =>
              dispatch(
                setCharacterSpriteDesign({
                  ...characterSpriteDesign,
                  hairStyle: e.target.value,
                }),
              )
            }
          >
            <option value="" disabled hidden>
              Select...
            </option>
            <option value="Hair1">Style 1</option>
          </select>
        </div>

        <div className={styles.clothing}>
          <label htmlFor="clothingStyle">Clothing Style:</label>
          <br />
          <select
            id="clothingStyle"
            defaultValue=""
            onChange={(e) =>
              dispatch(
                setCharacterSpriteDesign({
                  ...characterSpriteDesign,
                  clothingStyle: e.target.value,
                }),
              )
            }
          >
            <option value="" disabled hidden>
              Select...
            </option>
            <option value="Clothing1">Style 1</option>
          </select>
        </div>
      </div>
    </div>
  );
}
