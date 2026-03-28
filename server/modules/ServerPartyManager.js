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
            socket.on('clientSendPartyInvite', (toPlayerName, cb) =>
            {
                const toPlayer = this.serverPlayerManager.playersOnline.get(this.serverPlayerManager.characterNameToId.get(toPlayerName));
                const toPlayerSocket = toPlayer ? toPlayer.socketId : null;
                const fromPlayerName = this.serverPlayerManager.playersOnline.get(socket.playerId)?.characterData.name || "Unknown";
                if (!toPlayerSocket) 
                {
                    return cb({ success: false, message: `Player ${toPlayerName} not found` });
                }
                if (toPlayerSocket.id === socket.id)
                {
                    return cb({ success: false, message: `You cannot invite yourself to a party` });
                }
                cb({ success: true, message: `Party invite sent to ${toPlayerName}` });
                this.io.to(toPlayerSocket).emit('serverSendPartyInvite', { fromPlayerName });
            });

            socket.on('clientAcceptPartyInvite', (fromPlayerName, cb) =>
            {
                console.log(`Player ${socket.playerId} is accepting a party invite from ${fromPlayerName}`);
                const fromPlayer = this.serverPlayerManager.playersOnline.get(this.serverPlayerManager.characterNameToId.get(fromPlayerName));
                const fromPlayerSocket = fromPlayer ? fromPlayer.socketId : null;
                if (!fromPlayerSocket) 
                {
                    return cb({ success: false, message: `Player ${fromPlayerName} not found` });
                }
                if (fromPlayerSocket.id === socket.id)
                {
                    return cb({ success: false, message: `You cannot accept an invite from yourself` });
                }
                try 
                {
                    // For simplicity, we'll just create a party with the inviter as the leader and the invitee as a member
                    const partyLeaderId = this.serverPlayerManager.characterNameToId.get(fromPlayerName);
                    const partyMemberId = socket.playerId;
                    this.serverPlayerManager.playerParties.set(partyLeaderId, { leader: partyLeaderId, members: [partyMemberId] });
                    cb({ success: true, message: `You have joined the party led by ${fromPlayerName}` });
                }
                catch (error)
                {
                    console.error('Error accepting party invite:', error);
                    cb({ success: false, message: 'An error occurred while accepting the party invite' });
                }
            });
        });
    }
}

module.exports = ServerPartyManager;