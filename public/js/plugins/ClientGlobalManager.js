class ClientGlobalManager 
{
    constructor()
    {
        this.SERVER_CONFIG = window.SERVER_CONFIG
        this.dispatchToReact = null;
        this.clientInputManager = null;
        this.clientPlayerManager = null;
        this.clientMapManager = null;
        this.clientPartyManager = null;
        this.clientEncounterManager = null;
        this.clientShopManager = null;
    }
}

window.clientGlobalManager = new ClientGlobalManager();