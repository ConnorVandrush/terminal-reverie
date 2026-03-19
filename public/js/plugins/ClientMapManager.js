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
        console.log('Requesting move in direction:', direction);
        try 
        {
            const response = await window.clientGlobalManager.socket.emitWithAck('clientPlayerMove', direction);
            console.log('Move response from server:', response);    
            if (!response?.success) 
            {
                this.rollbackPlayer($gamePlayer, oldLoc);
            } 
            else 
            {
                const loc = window.clientGlobalManager.characterData.location;
                loc.x = response.newLocation.x;
                loc.y = response.newLocation.y;
                console.log('Move successful, new location:', loc);
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
}

window.clientGlobalManager.clientMapManager = new ClientMapManager();