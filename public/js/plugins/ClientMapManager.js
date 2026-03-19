class ClientMapManager
{
    constructor()
    {
        this.isMoving = false;
        this.isTransferring = false;
        this.idleTimeout = null;
    }

    // called by ClientInputManager when player initiates movement see engine overrides
    async requestMove(direction, oldLoc) 
    {
        try 
        {
            const response = await window.clientGlobalManager.clientPlayerManager.socket.emitWithAck('clientPlayerMove', direction); 
            if (!response?.success) 
            {
                this.rollbackPlayer($gamePlayer, oldLoc);
            } 
            else 
            {
                const loc = window.clientGlobalManager.clientPlayerManager.characterData.location;
                loc.x = response.newLocation.x;
                loc.y = response.newLocation.y;
            }
        } 
        catch (err) 
        {
            this.rollbackPlayer($gamePlayer, oldLoc);
        } 
        finally 
        {
            this.waitForMovementEnd($gamePlayer);
        }
    }

    rollbackPlayer(player, oldLoc) 
    {
        player.locate(oldLoc.x, oldLoc.y);
        player.setDirection(oldLoc.d);
    }

    waitForMovementEnd(player) 
    {
        const unlock = () => 
        {
            if (!player.isMoving()) 
            {
                this.isMoving = false;

                if (this.idleTimeout) clearTimeout(this.idleTimeout);

                this.idleTimeout = setTimeout(() => 
                {
                    player._pattern = 1; // idle stance
                }, 500);
            } 
            else 
            {
                requestAnimationFrame(unlock);
            }
        };
        unlock();
    }

    startListeners()
    {
        window.clientGlobalManager.clientPlayerManager.socket.on('serverPlayerMoved', ({ playerId, newLocation }) =>
        {
            const eventId = window.clientGlobalManager.clientPlayerManager.playersOnMap.get(playerId)?.eventId;
            const gameEvent = $gameMap._events[eventId];
            console.log('Player ' + playerId + ' moved to ', newLocation, ' with eventId ', eventId, ' gameEvent: ', gameEvent);
            if (gameEvent) 
            {
                gameEvent._netTargetX = newLocation.x;
                gameEvent._netTargetY = newLocation.y;
            }
        });
    }
}

window.clientGlobalManager.clientMapManager = new ClientMapManager();