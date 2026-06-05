class ServerPlayerManager {
  constructor(io) {
    this.socketIdToSocket = new Map(); // socketId -> socket
    this.playersOnline = new Map(); // playerId -> PlayerData
    this.playersOnMaps = new Map(); // mapName -> Map of playerIds -> PlayerData
    this.characterNameToId = new Map(); // characterName -> playerId
    this.io = io;
  }

  playerJoinMap(socket, playerId, mapName) {
    if (!this.playersOnMaps.has(mapName)) {
      this.playersOnMaps.set(mapName, new Map());
    }

    const map = this.playersOnMaps.get(mapName);

    // 1. Add player FIRST (atomic update)
    const characterData = this.playersOnline.get(playerId).characterData;
    map.set(playerId, characterData);

    // 2. Join the room AFTER the map is updated
    socket.join(mapName);

    // 3. Send FULL updated list to the joining player
    socket.emit("serverPlayersOnMap", Array.from(map.entries()));

    // 4. Notify all other players that someone joined
    socket
      .to(mapName)
      .emit("serverPlayerJoinedMap", { playerId, characterData });
  }

  playerLeftMap(socket, playerId, mapName) {
    socket.leave(mapName);
    if (this.playersOnMaps.has(mapName)) {
      this.playersOnMaps.get(mapName).delete(playerId);
      this.io.to(mapName).emit("serverPlayerLeftMap", playerId);
    }
  }

  startListeners() {
    this.io.on("connection", (socket) => {});
  }
}

module.exports = ServerPlayerManager;
