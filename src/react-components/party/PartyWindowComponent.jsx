import { useDispatch, useSelector } from "react-redux";

import styles from "./PartyWindowComponent.module.css";
import { setCenterPanel } from "@store/ui/CenterPanelSlice.js";
import { clientLeaveParty } from "@store/party/PartySlice";
import { clientUnequipItem } from "@store/inventory/InventorySlice";

export default function PartyWindowComponent() {
  const dispatch = useDispatch();

  const members = useSelector((state) => state.PartySlice.partyMembers) || [
    null,
    null,
    null,
    null,
  ];

  // Do NOT derive the player ID from partyMembers.
  // The player exists independently of the current party snapshot.
  const playerId = window.clientAPI.playerManager.playerCharacterId;

  const partySize = members.filter(
    (member) => member?.characterId != null,
  ).length;

  function handleUnequip(slot) {
    dispatch(clientUnequipItem(slot));
  }

  return (
    <div className={styles.partyWindow}>
      {members.map((member, index) => {
        // The slot is the identity, not the character.
        const key = `party-slot-${index}`;

        if (!member || member.characterId == null) {
          return (
            <div key={key} className={styles.partyMember}>
              <div className={styles.nameRow}>Empty Slot</div>
            </div>
          );
        }

        const isPlayer = member.characterId === playerId;
        const equipment = member.equipment ?? {};

        return (
          <div key={key} className={styles.partyMember}>
            <div className={styles.nameRow}>
              {member.name} Lv{member.level} HP: {member.currentHp}/
              {member.maxHp}
            </div>

            <div className={styles.equipment}>
              <div className={styles.leftColumn}>
                <div>
                  Weapon:{" "}
                  {isPlayer ? (
                    <button onClick={() => handleUnequip("weapon")}>
                      {equipment.weapon?.name || "None"}
                    </button>
                  ) : (
                    equipment.weapon?.name || "None"
                  )}
                </div>

                <div>
                  Armor:{" "}
                  {isPlayer ? (
                    <button onClick={() => handleUnequip("armor")}>
                      {equipment.armor?.name || "None"}
                    </button>
                  ) : (
                    equipment.armor?.name || "None"
                  )}
                </div>

                <div>
                  Accessory:{" "}
                  {isPlayer ? (
                    <button onClick={() => handleUnequip("accessory")}>
                      {equipment.accessory?.name || "None"}
                    </button>
                  ) : (
                    equipment.accessory?.name || "None"
                  )}
                </div>
              </div>

              <div className={styles.rightColumn}>
                <div>
                  Item 1:{" "}
                  {isPlayer ? (
                    <button onClick={() => handleUnequip("item1")}>
                      {equipment.item1?.name || "None"}
                    </button>
                  ) : (
                    equipment.item1?.name || "None"
                  )}
                </div>

                <div>
                  Item 2:{" "}
                  {isPlayer ? (
                    <button onClick={() => handleUnequip("item2")}>
                      {equipment.item2?.name || "None"}
                    </button>
                  ) : (
                    equipment.item2?.name || "None"
                  )}
                </div>

                <div>
                  Item 3:{" "}
                  {isPlayer ? (
                    <button onClick={() => handleUnequip("item3")}>
                      {equipment.item3?.name || "None"}
                    </button>
                  ) : (
                    equipment.item3?.name || "None"
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className={styles.buttonRow}>
        {partySize <= 1 && (
          <button
            data-testid="partyJoinInviteButton"
            onClick={() =>
              dispatch(setCenterPanel("PartyInvitesWindowComponent"))
            }
          >
            Join/Invite
          </button>
        )}

        {partySize >= 2 && (
          <button onClick={() => dispatch(clientLeaveParty())}>
            Leave Party
          </button>
        )}
      </div>
    </div>
  );
}
