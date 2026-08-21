import { useSelector, useDispatch } from "react-redux";
import styles from "./EncounterTurnOrderComponent.module.css";
import { setEncounterTarget } from "@store/encounter/EncounterSlice";

export default function EncounterTurnOrderComponent() {
  const dispatch = useDispatch();

  const members = useSelector((state) => state.PartySlice.partyMembers);
  const enemies = useSelector((state) => state.EncounterSlice.enemies);
  const turnOrder = useSelector((state) => state.EncounterSlice.turnOrder);
  const currentTarget = useSelector((state) => state.EncounterSlice.target);
  const roundNumber = useSelector((state) => state.EncounterSlice.roundNumber);

  function handleSelectTarget(side, index) {
    if (currentTarget?.side === side && currentTarget?.index === index) {
      dispatch(setEncounterTarget(null));
      return;
    }

    dispatch(
      setEncounterTarget({
        side,
        index,
      }),
    );
  }

  const combatants = [];

  members.forEach((member, index) => {
    if (!member) return;

    combatants.push({
      side: "ally",
      index,
      id: member.characterId,
      name: member.name,
    });
  });

  enemies.forEach((enemy, index) => {
    if (!enemy) return;

    combatants.push({
      side: "enemy",
      index,
      id: enemy.enemyInstanceId,
      name: enemy.name,
    });
  });

  const orderedCombatants = [...combatants].sort(
    (a, b) => turnOrder.indexOf(a.id) - turnOrder.indexOf(b.id),
  );

  return (
    <div className={styles.encounterTurnOrderComponentStyle}>
      R{roundNumber} Turn Order
      {orderedCombatants.map((combatant) => (
        <div key={`${combatant.side}-${combatant.index}`}>
          <button
            className={
              currentTarget?.side === combatant.side &&
              currentTarget?.index === combatant.index
                ? styles.selected
                : ""
            }
            onClick={() => handleSelectTarget(combatant.side, combatant.index)}
          >
            {combatant.name}
          </button>
        </div>
      ))}
    </div>
  );
}
