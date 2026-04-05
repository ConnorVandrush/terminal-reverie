const { set } = require("mongoose");

class ServerPartyManager
{
    constructor(io, serverPlayerManager)
    {
        this.io = io;
        this.serverPlayerManager = serverPlayerManager;
        this.playerParties = new Map(); // partyLeaderId -> [characterDatas]
    }

    checkOrthogonalAdjacency(playerId1, playerId2)
    {
        const p1 = this.serverPlayerManager.playersOnline.get(playerId1);
        const p2 = this.serverPlayerManager.playersOnline.get(playerId2);
        if (!p1 || !p2) return false;

        const x1 = p1.characterData.location.x;
        const y1 = p1.characterData.location.y;
        const x2 = p2.characterData.location.x;
        const y2 = p2.characterData.location.y;

        const dx = Math.abs(x1 - x2);
        const dy = Math.abs(y1 - y2);

        // Same tile OR orthogonally adjacent
        return (dx === 0 && dy === 0) || (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
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
                socket.join(`party_${socket.playerId}`);
                cb({ success: true, message: `Party invite sent to ${toPlayerName}` });
                this.io.to(toPlayerSocket).emit('serverSendPartyInvite', { fromPlayerName });
            });

            socket.on('clientAcceptPartyInvite', (fromPlayerName, cb) =>
            {
                if (this.checkOrthogonalAdjacency(socket.playerId, this.serverPlayerManager.characterNameToId.get(fromPlayerName)))
                {
                    const fromPlayer = this.serverPlayerManager.playersOnline.get(this.serverPlayerManager.characterNameToId.get(fromPlayerName));
                    const fromPlayerSocket = fromPlayer ? fromPlayer.socketId : null;
                    const toPlayer = this.serverPlayerManager.playersOnline.get(socket.playerId);
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
                        const partyLeaderId = this.serverPlayerManager.characterNameToId.get(fromPlayerName);
                        if (this.playerParties.has(partyLeaderId))
                        {
                            const partyData = this.playerParties.get(partyLeaderId);
                            if (!partyData.members.includes(toPlayer.characterData))
                            {
                                partyData.members.push(toPlayer.characterData);
                                socket.join(`party_${partyLeaderId}`);
                            }
                        }
                        else
                        {
                            this.playerParties.set(partyLeaderId, { members: [fromPlayer.characterData, toPlayer.characterData] });
                            socket.join(`party_${partyLeaderId}`);
                        }
                        fromPlayer.preventMovement = true;
                        cb({ success: true });
                        this.io.to('party_' + partyLeaderId).emit('serverUpdatePartyData', this.playerParties.get(partyLeaderId));
                    }
                    catch (error)
                    {
                        console.error('Error accepting party invite:', error);
                        cb({ success: false, message: 'An error occurred while accepting the party invite' });
                    }
                }
                else
                {
                    cb({ success: false, message: `You must be adjacent to ${fromPlayerName} to accept the party invite` });
                }
            });
            
            socket.on('partyAssembled', () => 
            {
                const playerData = this.serverPlayerManager.playersOnline.get(socket.playerId);
                if (!playerData) return;
                playerData.preventMovement = false;
            });

            socket.on('clientLeaveParty', (partyLeaderId, cb) =>
            {
                const playerData = this.serverPlayerManager.playersOnline.get(socket.playerId);
                const partyData = this.playerParties.get(partyLeaderId);
                if (!playerData || !partyData) 
                {
                    return cb({ success: false, message: 'Party not found' });
                }
                const memberIndex = partyData.members.findIndex(member => member.playerId === socket.playerId);
                if (memberIndex === -1) 
                {
                    return cb({ success: false, message: 'You are not a member of this party' });
                }
                partyData.members.splice(memberIndex, 1);
                socket.leave(`party_${partyLeaderId}`);
                this.io.to(socket.id).emit('serverUpdatePartyData', null);
                playerData.preventMovement = false;
                if (partyData.members.length === 1)
                {
                    this.io.to('party_' + partyLeaderId).emit('serverUpdatePartyData', null);
                    this.io.in(`party_${partyLeaderId}`).socketsLeave('party_' + partyLeaderId);
                    this.playerParties.delete(partyLeaderId);
                    cb({ success: true, message: 'You have left the party. The party has been disbanded since there was only one member left.' });
                }
                else if (partyLeaderId === socket.playerId && partyData.members.length > 1)
                {
                    const newLeaderId = partyData.members[0].playerId;
                    this.playerParties.set(newLeaderId, partyData);
                    this.playerParties.delete(partyLeaderId);
                    this.io.in(`party_${partyLeaderId}`).socketsJoin('party_' + newLeaderId);
                    this.io.in(`party_${partyLeaderId}`).socketsLeave('party_' + partyLeaderId);
                    partyLeaderId = newLeaderId;
                    cb({ success: true, message: 'You have left the party. A new leader has been assigned.' });
                    this.io.to('party_' + partyLeaderId).emit('serverUpdatePartyData', partyData);
                }
                else if (partyData.members.length > 1)
                {

                    cb({ success: true, message: 'You have left the party' });
                    this.io.to('party_' + partyLeaderId).emit('serverUpdatePartyData', partyData);
                }
            });
        });
    }
}

module.exports = ServerPartyManager;