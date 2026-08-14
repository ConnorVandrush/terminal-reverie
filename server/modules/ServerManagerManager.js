export default class ServerManagerManager {
  constructor() {
    this.serverManager;
    this.playerManager;
    this.mapManager;
    this.encounterManager;
    this.inventoryManager;
  }

  manageManagers(
    serverManager,
    playerManager,
    mapManager,
    encounterManager,
    inventoryManager,
  ) {
    this.serverManager = serverManager;
    this.playerManager = playerManager;
    this.mapManager = mapManager;
    this.encounterManager = encounterManager;
    this.inventoryManager = inventoryManager;
  }
}
