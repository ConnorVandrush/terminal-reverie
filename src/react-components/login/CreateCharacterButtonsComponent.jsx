import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import styles from "./CreateCharacterButtonsComponent.module.css";
import { randomizeCharacterSpriteDesign } from "@store/party/PartySlice";

export default function CreateCharacterButtonsComponent() {
  const dispatch = useDispatch();

  const createCharacterName = useSelector(
    (state) => state.PartySlice.createCharacterName,
  );

  const createCharacterAppearance = useSelector(
    (state) => state.PartySlice.createCharacterAppearance,
  );

  const handleCreateCharacter = () => {
    window.clientAPI.createCharacterCB.call({
      name: createCharacterName,
      appearance: createCharacterAppearance,
    });
  };

  useEffect(() => {
    dispatch(randomizeCharacterSpriteDesign());
  }, []);

  return (
    <div className={styles.createCharacterButtonsComponentStyle}>
      <div className={styles.randomizeAppearanceButton}>
        <button
          type="button"
          id="randomizeAppearanceButton"
          onClick={() => dispatch(randomizeCharacterSpriteDesign())}
        >
          Randomize Appearance
        </button>
      </div>

      <div className={styles.createCharacterButton}>
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
