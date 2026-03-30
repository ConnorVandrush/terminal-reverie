class ClientGlobalManager 
{
    constructor()
    {
        this.SERVER_CONFIG = window.SERVER_CONFIG
        this.clientInputManager = null;
        this.clientPlayerManager = null;
        this.clientMapManager = null;
        this.clientPartyManager = null;
    }
}

window.clientGlobalManager = new ClientGlobalManager();