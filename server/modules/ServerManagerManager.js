export default class ServerManagerManager {
  constructor() {
    this.serverManager;
    this.playerManager;
    this.mapManager;
  }

  manageManagers(serverManager, playerManager, mapManager) {
    this.serverManager = serverManager;
    this.playerManager = playerManager;
    this.mapManager = mapManager;
  }
}
