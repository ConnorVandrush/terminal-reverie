export default function EncounterSliceListeners(store, action) {
  window.clientAPI.authNamespace.on("serverStartEncounter", (data, cb) => {
    {
      const { troopData, rmmzEnemyData, reactEnemyData } = data;
      window.clientAPI.encounterManager.serverStartEncounter(
        troopData,
        rmmzEnemyData,
        reactEnemyData,
      );
    }
  });
}
