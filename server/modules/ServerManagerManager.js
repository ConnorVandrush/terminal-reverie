export default class ServerManagerManager {
  constructor() {
    this.serverManager;
    this.playerManager;
    this.mapManager;
    this.encounterManager;
  }

  manageManagers(serverManager, playerManager, mapManager, encounterManager) {
    this.serverManager = serverManager;
    this.playerManager = playerManager;
    this.mapManager = mapManager;
    this.encounterManager = encounterManager;
  }
}
