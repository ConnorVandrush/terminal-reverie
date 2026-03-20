class ClientMapManager
{
    constructor()
    {
        this.isMoving = false;
        this.isTransferring = false;
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
            } 
            else 
            {
                requestAnimationFrame(unlock);
            }
        };
        unlock();
    }

    async requestMapTransfer()
    {
        this.isMoving = true;
        this.isTransferring = true;

        const response = await window.clientGlobalManager.clientPlayerManager.socket.emitWithAck('clientRequestMapTransfer');

        if (response?.success)
        {
            this.transferToMap(response.mapData, response.tileset, response.x, response.y, response.d, response.playersOnMap);
        }
    }

    transferToMap(mapData, tileset, x, y, d, playersOnMap)
    {
        const loc = window.clientGlobalManager.clientPlayerManager.characterData.location;
        loc.x = x;
        loc.y = y;
        loc.d = d;
        loc.map = mapData.name;

        window.clientGlobalManager.clientPlayerManager.playersOnMap.clear();
        window.clientGlobalManager.clientPlayerManager.pendingRemotePlayers = new Map(playersOnMap);

        $dataTilesets[mapData.tilesetId] = structuredClone(tileset);
        const map = structuredClone(mapData);
        map.id = Date.now();
        $dataMap = map;
        $gamePlayer.reserveTransfer(map.id, x, y, d);
        SceneManager.goto(Scene_Map);
    }

    startListeners()
    {
        window.clientGlobalManager.clientPlayerManager.socket.on('serverPlayerMoved', ({ playerId, newLocation }) =>
        {
            if (this.isTransferring) return; // ignore movements during transfer
            const eventId = window.clientGlobalManager.clientPlayerManager.playersOnMap.get(playerId)?.eventId;
            const gameEvent = $gameMap._events[eventId];
            if (gameEvent) 
            {
                gameEvent._netTargetX = newLocation.x;
                gameEvent._netTargetY = newLocation.y;
            }
        });
    }
}

window.clientGlobalManager.clientMapManager = new ClientMapManager();