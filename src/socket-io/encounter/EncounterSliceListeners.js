export default function EncounterSliceListeners(store, action) {
  window.clientAPI.authNamespace.on("serverStartEncounter", (data, cb) => {
    const { troopData, rmmzEnemyData, reactEnemyData, firstTurnOrder } = data;
    window.clientAPI.encounterManager.serverStartEncounter(
      troopData,
      rmmzEnemyData,
      reactEnemyData,
      firstTurnOrder,
    );
  });

  window.clientAPI.authNamespace.on("serverEncounterRoundResults", (data) => {
    const { roundResults, turnOrder, encounterResult, drops } = data;

    window.clientAPI.encounterManager.serverEncounterRoundResults(
      roundResults,
      turnOrder,
      encounterResult,
      drops,
    );
  });
}
