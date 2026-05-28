class ServerChatManager {
  constructor(io, serverPlayerManager) {
    this.io = io;
    this.serverPlayerManager = serverPlayerManager;
  }

  startListeners = () => {
    this.io.on("connection", (socket) => {
      socket.on("clientSendChatMessage", (message) => {
        const player = this.serverPlayerManager.playersOnline.get(
          socket.playerId,
        );
        const map = player?.characterData?.location?.map;
        if (player && map) {
          this.io
            .to(map)
            .emit("serverBroadcastChatMessage", {
              message,
              sender: player.characterData.name,
            });
        }
      });
    });
  };
}

module.exports = ServerChatManager;
