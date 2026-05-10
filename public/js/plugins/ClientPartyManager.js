class ClientPartyManager
{
    constructor()
    {
        this.clientPlayerManager = window.clientGlobalManager.clientPlayerManager;
        this.clientMapManager = window.clientGlobalManager.clientMapManager;
        this.partyData = null; // { members: [characterDatas] }
        this.isPartyFollower = false;
        this.isPartyLeader = false;
    }

    async requestPartyMove(dir)
    {
        try
        {
            this.clientPlayerManager.socket.emit('clientPartyMove', dir);
        }
        catch (err)
        {
            console.error('Error occurred while requesting party move:', err);
        }
    }

    findPartyIndex(playerId)
    {
        return window.clientGlobalManager.clientPartyManager.partyData.members.findIndex(member => member.playerId === playerId)
    }

    startListeners()
    {
        const socket = this.clientPlayerManager.socket;
        socket.on('serverUpdatePartyData', (partyData) =>
        {
            this.isPartyFollower = false;
            this.isPartyLeader = false;
            this.partyData = partyData;
            const state = window.clientGlobalManager.getReactState();
            const oldPartyData = state.partyWindow.partyData;
            const characterData = oldPartyData?.members?.find(m => m.playerId === window.clientGlobalManager.clientPlayerManager.characterData.playerId) || null;
            console.log('Received party data update:', characterData );
            const frozenReactPartyData = structuredClone(partyData)
            window.clientGlobalManager.dispatchToReact({ type: 'partyWindow/setPartyData', payload: frozenReactPartyData });
            if (partyData !== null && partyData.members[0].playerId === this.clientPlayerManager.characterData.playerId)
            {
                this.isPartyLeader = true;
                this.clientMapManager.isMoving = true;
                setTimeout(() =>
                {
                    socket.emit('clientPartyAssembled');
                    this.clientMapManager.isMoving = false;
                }, 3000);
            }
            else if (partyData !== null)
            {
                this.clientMapManager.moveToLocation($gamePlayer, partyData.members[0].location);
                this.isPartyFollower = true;
            }
            else if (partyData === null)
            {
                this.isPartyFollower = false;
                this.isPartyLeader = false;
                window.clientGlobalManager.clientPartyManager.partyData = { members: characterData ? [characterData] : [] };
                window.clientGlobalManager.dispatchToReact({ type: 'partyWindow/setPartyData', payload: { members: characterData ? [characterData] : [] } });
            }
        });
    }
}

window.clientGlobalManager.clientPartyManager = new ClientPartyManager();