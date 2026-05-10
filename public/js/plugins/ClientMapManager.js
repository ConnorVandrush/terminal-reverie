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
                console.error('Move request failed or no response received', response);
                this.rollbackPlayer($gamePlayer, oldLoc);
            } 
            else 
            {
                const loc = window.clientGlobalManager.clientPlayerManager.characterData.location;
                loc.x = response.newLocation.x;
                loc.y = response.newLocation.y;

                if (response.encounter != null)
                {
                    window.clientGlobalManager.clientEncounterManager.startEncounter(response.encounter);
                }
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

    moveToLocation(player, newLoc)
    {
        while (player.x !== newLoc.x || player.y !== newLoc.y)
        {
            if (player.isMoving())
            {
                this.waitForMovementEnd(player);
            }
            this.isMoving = true;
            const dir = player.findDirectionTo(newLoc.x, newLoc.y);
            player.moveStraight(dir);
            this.waitForMovementEnd(player);
            if (!window.clientGlobalManager.clientPartyManager.isPartyLeader && !window.clientGlobalManager.clientPartyManager.isPartyFollower)
            {
                this.requestMove(dir, { x: player.x, y: player.y, d: dir });
            }
        }
    }

    async requestMapTransfer()
    {
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
        $gamePlayer.reserveTransfer(map.id, x, y, d, 0);
        SceneManager.goto(Scene_Map);
    }

    startListeners()
    {
        const socket = window.clientGlobalManager.clientPlayerManager.socket;
        socket.on('serverPlayerMoved', ({ playerId, newLocation }) =>
        {
            if (this.isTransferring) return;

            const eventId = window.clientGlobalManager.clientPlayerManager.playersOnMap.get(playerId)?.eventId;
            const gameEvent = $gameMap._events[eventId];
            if (!gameEvent) return;

            gameEvent._netMovementQueue = gameEvent._netMovementQueue || [];

            const startX = gameEvent.x;
            const startY = gameEvent.y;
            const targetX = newLocation.x;
            const targetY = newLocation.y;

            let x = startX;
            let y = startY;

            // Push intermediate steps until we reach the target
            while (x !== targetX || y !== targetY) 
            {
                if (x < targetX) x++;
                else if (x > targetX) x--;

                if (y < targetY) y++;
                else if (y > targetY) y--;

                gameEvent._netMovementQueue.push({ x, y });
            }
        });

        socket.on('serverPartyMoved', ({ newLocations, inEncounter }) =>
        {
            if (this.isTransferring) return;

            for (const { playerId, newLocation } of newLocations)
            {
                const isLocalPlayer =
                    playerId === window.clientGlobalManager.clientPlayerManager.characterData.playerId;

                const character = isLocalPlayer
                    ? $gamePlayer
                    : $gameMap._events[
                        window.clientGlobalManager.clientPlayerManager.playersOnMap.get(playerId)?.eventId
                    ];

                if (!character) continue;

                character._netMovementQueue = character._netMovementQueue || [];

                const startX = character.x;
                const startY = character.y;
                const targetX = newLocation.x;
                const targetY = newLocation.y;

                let x = startX;
                let y = startY;

                // Clear old stale movement if needed
                character._netMovementQueue.length = 0;

                while (x !== targetX || y !== targetY)
                {
                    // Move horizontally first
                    if (x < targetX)
                    {
                        x++;
                    }
                    else if (x > targetX)
                    {
                        x--;
                    }
                    // Then move vertically
                    else if (y < targetY)
                    {
                        y++;
                    }
                    else if (y > targetY)
                    {
                        y--;
                    }

                    character._netMovementQueue.push({ x, y });
                }
            }
        });
    }
}

window.clientGlobalManager.clientMapManager = new ClientMapManager();