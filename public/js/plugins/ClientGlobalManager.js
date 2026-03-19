class ClientGlobalManager 
{
    constructor()
    {
        this.clientInputManager = null;
        this.clientPlayerManager = null;
        this.clientMapManager = null;
    }
}

window.clientGlobalManager = new ClientGlobalManager();