class ClientGlobalManager 
{
    constructor()
    {
        this.publicNamespace = null;
        this.io = null;
        this.clientInputManager = null;
        this.refreshTokenTimeout = null;
    }

    initAuthenticatedSocket()
    {
        const JWT = localStorage.getItem('JWT');
        if (!JWT) return null;

        const socket = io('http://46.110.113.183:15987', 
        {
            auth: { JWT },
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
        });

        this.io = socket;
    }
}

window.clientGlobalManager = new ClientGlobalManager();