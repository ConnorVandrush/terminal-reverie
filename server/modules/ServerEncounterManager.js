export default class EncounterManager {
  constructor(serverAPI) {
    this.serverAPI = serverAPI;
    this.activeEncounters = new Map(); // partyLeaderId -> encounter
  }

  randomElement(arr) {
    const idx = Math.floor(Math.random() * arr.length);
    return arr[idx];
  }

  divvyDrops(encounter) {
    const gold = Math.floor(encounter.goldDrop / encounter.characters.length);

    const exp = Math.floor(encounter.expDrop / encounter.characters.length);

    const characterItems = new Map(
      encounter.characters.map((character) => [character.characterId, []]),
    );

    while (encounter.itemDrop.length > 0) {
      const itemId = encounter.itemDrop.pop();

      const itemData = this.serverAPI.inventoryManager.getItemData(itemId);

      if (!itemData) {
        console.warn(`Could not find item data for item ID: ${itemId}`);
        continue;
      }

      const winner = this.randomElement(encounter.characters);

      const characterData = this.serverAPI.playerManager.charactersOnline.get(
        winner.characterId,
      );

      if (!characterData) {
        console.warn(`Could not find character ${winner.characterId}`);
        continue;
      }

      if (characterData.inventory[itemId]) {
        characterData.inventory[itemId].qty += 1;
      } else {
        characterData.inventory[itemId] = {
          qty: 1,
          itemData,
        };
      }

      characterItems.get(winner.characterId).push(itemData);
    }

    // Give everyone their gold/exp
    encounter.characters.forEach((character) => {
      const characterData = this.serverAPI.playerManager.charactersOnline.get(
        character.characterId,
      );

      if (!characterData) {
        return;
      }

      characterData.gold += gold;
      characterData.experience += exp;
    });

    return {
      gold,
      exp,
      characterItems,
    };
  }

  startListeners() {
    this.serverAPI.serverManager.authNamespace.on("connection", (socket) => {
      socket.on("clientSubmitEncounterAction", (payload) => {
        const characterData = this.serverAPI.playerManager.charactersOnline.get(
          socket.characterId,
        );

        const partyLeaderId = characterData.partyMemberIds[0];

        const encounter = this.activeEncounters.get(partyLeaderId);

        encounter.combatantActions.set(socket.characterId, payload);

        if (
          encounter.characters.filter((c) => c.canAct).length ===
          encounter.combatantActions.size
        ) {
          const { roundResults, encounterDrops } = encounter.processRound();

          let rewards = null;

          if (encounterDrops) {
            rewards = this.divvyDrops(encounter);

            this.activeEncounters.delete(partyLeaderId);
          }

          encounter.characters.forEach((character) => {
            this.serverAPI.serverManager.authNamespace
              .to(character.socketId)
              .emit("serverEncounterRoundResults", {
                roundResults,
                turnOrder: encounter.turnOrder,
                encounterResult: encounterDrops ? "victory" : null,
                drops: rewards
                  ? {
                      gold: rewards.gold,
                      exp: rewards.exp,
                      items: rewards.characterItems.get(character.characterId),
                    }
                  : null,
              });
          });
        }
      });
    });
  }
}
