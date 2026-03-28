class ServerPartyManager
{
    constructor(io, serverPlayerManager)
    {
        this.io = io;
        this.serverPlayerManager = serverPlayerManager;
    }

    startListeners()
    {
        this.io.on('connection', (socket) =>
        {
            socket.on('clientSendPartyInvite', (toPlayerName) =>
            {
                const toPlayerId = this.serverPlayerManager.characterNameToId.get(toPlayerName);
                const fromPlayerName = this.serverPlayerManager.playersOnline.get(socket.playerId)?.characterData.name || "Unknown";
                if (!toPlayerId) {
                    console.error(`Player ${toPlayerName} not found`);
                    return;
                }
                console.log(`Player ${fromPlayerName} sent a party invite to Player ${toPlayerId}`);
                this.io.to(toPlayerId).emit('serverSendPartyInvite', { fromPlayerName });
            });
        });
    }
}

module.exports = ServerPartyManager;