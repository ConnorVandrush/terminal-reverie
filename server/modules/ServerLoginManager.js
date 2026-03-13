class ServerLoginManager
{
    constructor(publicNamespace)
    {
        this.publicNamespace = publicNamespace;
    }

    startListeners()
    {
        this.publicNamespace.on('connection', (socket) =>
        {
            socket.on('clientLogin', (data) =>
            {
                console.log('Login attempt:', data);
            });
        });
    }
}

module.exports = ServerLoginManager;