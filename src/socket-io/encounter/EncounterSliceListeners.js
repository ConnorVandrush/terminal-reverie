export default function EncounterSliceListeners(store, action) {
  window.clientAPI.authNamespace.on("serverStartEncounter", (data, cb) => {
    {
      const { troopData, enemyData } = data;
      window.clientAPI.encounterManager.serverStartEncounter(
        troopData,
        enemyData,
      );
    }
  });
}
