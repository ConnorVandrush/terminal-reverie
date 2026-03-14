class ServerPlayerManager
{
    constructor()
    {
        this.playersOnline = new Map();
        this.tokenTimeouts = new Map();
    }
}

module.exports = ServerPlayerManager;