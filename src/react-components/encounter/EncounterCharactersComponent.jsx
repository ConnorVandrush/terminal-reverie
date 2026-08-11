import { useSelector } from "react-redux";
import styles from "./EncounterCharactersComponent.module.css";

export default function EncounterCharactersComponent() {
  const members = useSelector((state) => state.PartySlice.partyMembers);

  return (
    <div className={styles.encounterCharactersComponentStyle}>
      {members.map((member, index) =>
        member ? (
          <div key={index}>
            <button>{member.name}</button>
          </div>
        ) : null,
      )}
    </div>
  );
}
