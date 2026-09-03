export default class EncounterManager {
  constructor(serverAPI) {
    this.serverAPI = serverAPI;
    this.activeEncounters = new Map(); // partyLeaderId -> encounter
  }

  randomElement(arr) {
    const idx = Math.floor(Math.random() * arr.length);
    return arr[idx];
  }

  async divvyDrops(encounter) {
    const mani = Math.floor(encounter.maniDrop / encounter.characters.length);
    const exp = Math.floor(encounter.expDrop / encounter.characters.length);

    // Track items each character receives
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

      // Pick random winner
      const winner = this.randomElement(encounter.characters);

      // Add item using your new function
      const result = await this.serverAPI.inventoryManager.addItemToInventory(
        winner.characterId,
        itemId,
        1,
      );

      if (!result.success) {
        console.warn(
          `Failed to add item ${itemId} to ${winner.characterId}: ${result.error}`,
        );
        continue;
      }

      // Track item for encounter results
      characterItems.get(winner.characterId).push(itemData);
    }

    // Give everyone mani/exp
    for (const character of encounter.characters) {
      const characterData = this.serverAPI.playerManager.charactersOnline.get(
        character.characterId,
      );

      if (!characterData) continue;

      characterData.mani += mani;
      characterData.experience += exp;

      characterData.markModified("mani");
      characterData.markModified("experience");
      await characterData.save();
    }

    return {
      mani,
      exp,
      characterItems,
    };
  }

  startListeners() {
    this.serverAPI.serverManager.authNamespace.on("connection", (socket) => {
      socket.on("clientSubmitEncounterAction", async (payload) => {
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
            rewards = await this.divvyDrops(encounter);

            encounter.characters.forEach((character) => {
              const characterData =
                this.serverAPI.playerManager.charactersOnline.get(
                  character.characterId,
                );

              if (!characterData) {
                console.warn(
                  `Could not find character ${character.characterId} after encounter`,
                );
                return;
              }

              characterData.canAct = true;
              characterData.currentHp = Math.max(characterData.currentHp, 1);
              characterData.isDead = false;

              this.serverAPI.playerManager.serverSyncPartyData(
                character.characterId,
              );
            });

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
                      mani: rewards.mani,
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
