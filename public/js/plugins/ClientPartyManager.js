class ClientPartyManager
{
    constructor(serverPlayerManager)
    {
        this.serverPlayerManager = serverPlayerManager;
        this.partyData = null; // { leader: playerId, members: [...characterData] }
    }

    startListeners()
    {
        const socket = window.clientGlobalManager.clientPlayerManager.socket;
        socket.on('serverUpdatePartyData', (partyData) =>
        {
            this.partyData = partyData;
            // Update the client UI with the new party data
            console.log('Updated party data:', partyData);
        });
    }
}

window.clientGlobalManager.clientPartyManager = new ClientPartyManager();