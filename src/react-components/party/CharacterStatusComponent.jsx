import { useSelector } from "react-redux";

import styles from "./CharacterStatusComponent.module.css";
import { getPlayerCharacterData } from "@store/party/PartySlice";

export default function CharacterStatusComponent() {
  const playerCharacterData = useSelector(getPlayerCharacterData);

  return (
    <div className={styles.CharacterStatusComponent}>
      <div>{playerCharacterData.name}</div>
      <div>Lv:{playerCharacterData.level}</div>
      <div>Xp:{playerCharacterData.experience}</div>
      <div>
        Hp:{playerCharacterData.currentHp}/{playerCharacterData.maxHp}
      </div>
      <div>Gp:{playerCharacterData.gold}</div>
    </div>
  );
}
