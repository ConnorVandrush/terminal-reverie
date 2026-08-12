import { useSelector, useDispatch } from "react-redux";
import styles from "./EncounterCharactersComponent.module.css";
import { setTarget } from "@store/encounter/EncounterSlice";

export default function EncounterCharactersComponent() {
  const dispatch = useDispatch();

  const members = useSelector((state) => state.PartySlice.partyMembers);
  const currentTarget = useSelector((state) => state.EncounterSlice.target);

  function handleSelectTarget(index) {
    if (currentTarget?.side === "ally" && currentTarget?.index === index) {
      dispatch(setTarget(null));
      return;
    }
    dispatch(setTarget({ side: "ally", index: index }));
  }

  return (
    <div className={styles.encounterCharactersComponentStyle}>
      {members.map((member, index) =>
        member ? (
          <div key={index}>
            <button
              className={
                currentTarget?.side === "ally" && currentTarget?.index === index
                  ? styles.selected
                  : ""
              }
              onClick={() => handleSelectTarget(index)}
            >
              {member.name}
            </button>
          </div>
        ) : null,
      )}
    </div>
  );
}
