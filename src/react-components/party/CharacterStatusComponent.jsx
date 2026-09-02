import { useSelector } from "react-redux";

import styles from "./CharacterStatusComponent.module.css";
import { getPlayerCharacterData } from "@store/party/PartySlice";

export default function CharacterStatusComponent() {
  const playerCharacterData = useSelector(getPlayerCharacterData);

  return (
    <div className={styles.CharacterStatusComponent}>
      <div>{playerCharacterData.name}</div>
      <div>LV:{playerCharacterData.level}</div>
      <div>XP:{playerCharacterData.experience}</div>
      <div>
        HP:{playerCharacterData.currentHp}/{playerCharacterData.maxHp}
      </div>
      <div>M$:{playerCharacterData.mani}</div>
    </div>
  );
}
