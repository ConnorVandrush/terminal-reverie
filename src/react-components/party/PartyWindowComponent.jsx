import { useDispatch, useSelector } from "react-redux";

import styles from "./PartyWindowComponent.module.css";

export default function PartyWindowComponent() {
  const partyMember1 = useSelector((state) => state.PartySlice.partyMember1);
  const partyMember2 = useSelector((state) => state.PartySlice.partyMember2);
  const partyMember3 = useSelector((state) => state.PartySlice.partyMember3);
  const partyMember4 = useSelector((state) => state.PartySlice.partyMember4);

  return (
    <div className={styles.partyWindow}>
      <div className={styles.partyMember}>
        {partyMember1 && (
          <>
            <div className={styles.nameRow}>
              {partyMember1.name} Lv{partyMember1.level} HP:
              {partyMember1.currentHp}/{partyMember1.maxHp}
            </div>
            <div className={styles.equipment}>
              <div className={styles.leftColumn}>
                <div>Weapon: {partyMember1.equipment.weapon}</div>
                <div>Armor: {partyMember1.equipment.armor}</div>
                <div>Accessory: {partyMember1.equipment.accessory}</div>
              </div>
              <div className={styles.rightColumn}>
                <div>Item 1: {partyMember1.equipment.item1}</div>
                <div>Item 2: {partyMember1.equipment.item2}</div>
                <div>Item 3: {partyMember1.equipment.item3}</div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className={styles.partyMember}></div>
      <div className={styles.partyMember}></div>
      <div className={styles.partyMember}></div>
      <div className={styles.buttonRow}></div>
    </div>
  );
}
