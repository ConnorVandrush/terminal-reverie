export default class EncounterManager {
  constructor(serverAPI) {
    this.serverAPI = serverAPI;
    this.activeEncounters = new Map(); // partyLeaderId -> encounter
  }

  startListeners() {
    this.serverAPI.serverManager.authNamespace.on("connection", (socket) => {
      socket.on("clientSubmitEncounterAction", (payload) => {
        const characterData = this.serverAPI.playerManager.charactersOnline.get(
          socket.characterId,
        );
        const encounter = this.activeEncounters.get(
          characterData.partyMemberIds[0],
        );
        encounter.combatantActions.set(socket.characterId, payload);
        if (
          encounter.characters.filter((c) => c.canAct).length ===
          encounter.combatantActions.size
        ) {
          const roundResults = encounter.processRound();
          this.serverAPI.serverManager.authNamespace
            .to(characterData.partyRoom)
            .emit("serverEncounterRoundResults", {
              roundResults: roundResults,
              turnOrder: encounter.turnOrder,
            });
        }
      });
    });
  }
}
