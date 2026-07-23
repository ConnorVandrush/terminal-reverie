import { useDispatch, useSelector } from "react-redux";

import styles from "./PartyWindowComponent.module.css";
import { setCenterPanel } from "@store/ui/CenterPanelSlice.js";

export default function PartyWindowComponent() {
  const dispatch = useDispatch();

  const members = useSelector((state) => [
    state.PartySlice.partyMember1,
    state.PartySlice.partyMember2,
    state.PartySlice.partyMember3,
    state.PartySlice.partyMember4,
  ]);

  return (
    <div className={styles.partyWindow}>
      {members.map((member, index) => (
        <div key={index} className={styles.partyMember}>
          {member && (
            <>
              <div className={styles.nameRow}>
                {member.name} Lv{member.level} HP:
                {member.currentHp}/{member.maxHp}
              </div>

              <div className={styles.equipment}>
                <div className={styles.leftColumn}>
                  <div>Weapon: {member.equipment.weapon}</div>
                  <div>Armor: {member.equipment.armor}</div>
                  <div>Accessory: {member.equipment.accessory}</div>
                </div>

                <div className={styles.rightColumn}>
                  <div>Item 1: {member.equipment.item1}</div>
                  <div>Item 2: {member.equipment.item2}</div>
                  <div>Item 3: {member.equipment.item3}</div>
                </div>
              </div>
            </>
          )}
        </div>
      ))}

      <div className={styles.buttonRow}>
        <button
          onClick={() =>
            dispatch(setCenterPanel("PartyInvitesWindowComponent"))
          }
        >
          Join/Invite
        </button>
      </div>
    </div>
  );
}
