class ServerPlayerManager
{
    constructor(io)
    {
        this.playersOnline = new Map(); // playerId -> PlayerData
        this.playersOnMaps = new Map(); // mapName -> Map of playerIds -> PlayerData
        this.io = io;
    }

    playerJoinMap(socket, playerId, mapName)
    {
        if (!this.playersOnMaps.has(mapName))
        {
            this.playersOnMaps.set(mapName, new Map());
        }
        socket.join(mapName);
        const characterData = this.playersOnline.get(playerId).characterData;
        this.playersOnMaps.get(mapName).set(playerId, characterData);
        this.io.to(mapName).emit('serverPlayerJoinedMap', { playerId, characterData });
    }

    playerLeftMap(socket, playerId, mapName)
    {
        socket.leave(mapName);
        if (this.playersOnMaps.has(mapName))
        {
            this.playersOnMaps.get(mapName).delete(playerId);
            this.io.to(mapName).emit('serverPlayerLeftMap', playerId);
        }
    }

    startListeners()
    {
        this.io.on('connection', (socket) => 
        {
            // Handle new connections
        });
    }
}

module.exports = ServerPlayerManager;