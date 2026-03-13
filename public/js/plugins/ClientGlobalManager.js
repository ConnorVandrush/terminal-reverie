class ClientGlobalManager 
{
    constructor()
    {
        this.publicNamespace = null;
        this.clientInputManager = null;
    }
}

window.clientGlobalManager = new ClientGlobalManager();