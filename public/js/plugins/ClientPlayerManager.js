class ClientPlayerManager {
  constructor() {}

  async login() {
    window.clientAPI.authNamespace = io(
      "http://192.168.1.235:15987/authenticated",
      {
        auth: { token: localStorage.getItem("JWT") },
      },
    );
    const { mapData, tileset, eventData, charactersOnMap } =
      await window.clientAPI.authNamespace.emitWithAck("clientLoginToMap");
  }
}

window.clientAPI.playerManager = new ClientPlayerManager();
