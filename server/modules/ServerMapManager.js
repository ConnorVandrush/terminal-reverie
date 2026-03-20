const fs = require('fs');

class ServerMapManager
{
    constructor(io, serverPlayerManager)
    {
        this.io = io;
        this.serverPlayerManager = serverPlayerManager;
        this.maps = new Map();
    }

    loadMaps = () =>
    {
        const tilesets = new Map();
        const tilesetData = JSON.parse(fs.readFileSync('./server/data/maps/Tilesets.json', 'utf-8'));
        for (const tileset of tilesetData)
            {
                if (!tileset) continue;
                tilesets.set(tileset.id, tileset);
            }
            
        const mapFiles = fs.readdirSync('./server/data/maps');
        for (const mapFile of mapFiles)
        {
            const mapName = mapFile.split('.')[0];
            if (mapFile === 'Tilesets.json') continue;
            const mapData = JSON.parse(fs.readFileSync(`./server/data/maps/${mapFile}`, 'utf-8'));

            const eventData = new Map();
            for (const event of mapData.events) 
            {
                if (!event) continue; // skip null at index 0

                const eventCoord = `${event.x},${event.y}`;
                eventData.set(eventCoord, event);
            }

            this.maps.set(mapName, {mapData, tileset: tilesets.get(mapData.tilesetId), eventData});
        }
    }

    getEventData = (mapName, x, y) =>
    {
        const map = this.maps.get(mapName);
        if (!map) return null;

        return map.eventData.get(`${x},${y}`) || null;
    }

    directionBit(direction)
    {
        switch (direction)
        {
            case 2: return 1; // down
            case 4: return 2; // left
            case 6: return 4; // right
            case 8: return 8; // up
            default: return 0;
        }
    }

    layeredTiles = (mapData, x, y) =>
    {
        const width = mapData.width;
        const height = mapData.height;
        const data = mapData.data;

        const tiles = [];
        for (let z = 0; z < 4; z++) 
        {
            const index = (z * width * height) + (y * width + x);
            tiles.push(data[index]);
        }
        return tiles;
    }

    isEventBlocking(mapName, x, y) 
    {
        const event = this.maps.get(mapName)?.eventData.get(`${x},${y}`);
        if (!event) return false;

        const page = event.pages[0]; // TODO: resolve active page properly
        if (!page) return false;

        const priority = page.priorityType; // 0 = below, 1 = same, 2 = above
        const through = page.through;

        return (priority === 1 && !through);
    }

    isPassable = (mapName, x, y, direction) =>
    {
        if (!this.maps.has(mapName)) return false;

        const { mapData, tileset, eventData} = this.maps.get(mapName);
        if (!mapData) return false;
        const bit = this.directionBit(direction);    
        const flags = tileset.flags;

        if (x < 0 || y < 0 || x >= mapData.width || y >= mapData.height) return false;

        if (this.isEventBlocking(mapName, x, y)) 
        {
            return false;
        }

        const tiles = this.layeredTiles(mapData, x, y);
        for (const tileId of tiles) 
        {
            const flag = flags[tileId];

            if (flag & 0x10) continue;        // star tile → ignore
            if ((flag & bit) === 0) return true;   // passable
            if ((flag & bit) === bit) return false; // blocked
        }

        return false;
    }

    startListeners = (io) =>
    {
        this.io.on('connection', (socket) =>
        {
            socket.on('clientPlayerMove', async (direction, cb) =>
            {
                const playerData = this.serverPlayerManager.playersOnline.get(socket.playerId);
                playerData.characterData.location.d = direction;

                if (!playerData || playerData.isTransferring || playerData.isBattling)
                {
                    return cb({ success: false });
                }

                const currentLoc = playerData.characterData.location;
                let newLocation;
                switch (direction)
                {
                    case 2: newLocation = { ...playerData.characterData.location, y: playerData.characterData.location.y + 1 }; break; // down
                    case 4: newLocation = { ...playerData.characterData.location, x: playerData.characterData.location.x - 1 }; break; // left
                    case 6: newLocation = { ...playerData.characterData.location, x: playerData.characterData.location.x + 1 }; break; // right
                    case 8: newLocation = { ...playerData.characterData.location, y: playerData.characterData.location.y - 1 }; break; // up
                }

                const reverseDir = {2:8, 4:6, 6:4, 8:2};

                // check leaving current tile
                if (!this.isPassable(currentLoc.map, currentLoc.x, currentLoc.y, direction)) 
                {
                    return cb({ success: false });
                }

                // check entering destination tile
                if (!this.isPassable(newLocation.map, newLocation.x, newLocation.y, reverseDir[direction])) 
                {
                    return cb({ success: false });
                }

                playerData.characterData.location = newLocation;
                this.io.to(currentLoc.map).except(socket.id).emit('serverPlayerMoved', { playerId: socket.playerId, newLocation });
                return cb({ success: true, newLocation: newLocation });
            });

            socket.on('clientRequestMapTransfer', async (cb) =>
            {
                const playerData = this.serverPlayerManager.playersOnline.get(socket.playerId);
                playerData.isTransferring = true;
                if (!playerData) return cb({ success: false });

                const event = this.getEventData(playerData.characterData.location.map, playerData.characterData.location.x, playerData.characterData.location.y);
                if (!event) return cb({ success: false });

                if (event.name.startsWith('Transfer'))
                {
                    const start = event.name.indexOf("(") + 1;
                    const end = event.name.indexOf(")");
                    const destinationMap = event.name.slice(start, end);

                    let transferCommand = null;
                    for (const p of event.pages) {
                        transferCommand = p.list.find(c => c.code === 201);
                        if (transferCommand) break;
                    }

                    const x = transferCommand?.parameters[2] ?? 0;
                    const y = transferCommand?.parameters[3] ?? 0;
                    const d = transferCommand?.parameters[4] ?? 2;

                    const mapData = this.maps.get(destinationMap)?.mapData;
                    const tileset = this.maps.get(destinationMap)?.tileset;
                    const playersOnMap = this.serverPlayerManager.playersOnMaps.get(destinationMap) || new Map();

                    if (!mapData || !tileset) return cb({ success: false });

                    // this.serverPlayerManager.playersOnMaps.get(playerData.characterData.location.map)?.delete(socket.playerId);
                    // this.serverPlayerManager.playersOnMaps.get(destinationMap)?.set(socket.playerId, playerData.characterData);
                    // 
                    // socket.leave(playerData.characterData.location.map);
                    // socket.join(destinationMap);
                    // this.io.to(playerData.characterData.location.map).except(socket.id).emit('serverPlayerLeftMap', socket.playerId);
                    // this.io.to(destinationMap).emit('serverPlayerJoinedMap', { playerId: socket.playerId, characterData: playerData.characterData });

                    this.serverPlayerManager.playerLeftMap(socket, socket.playerId, playerData.characterData.location.map);
                    playerData.characterData.location = { x, y, d, map: destinationMap };
                    this.serverPlayerManager.playerJoinMap(socket, socket.playerId, destinationMap);
   
                    return cb({ success: true, x, y, d, mapData, tileset, playersOnMap: Array.from(playersOnMap.entries()) });
                }
            });

            socket.on('clientMapTransferComplete', () =>
            {
                const playerData = this.serverPlayerManager.playersOnline.get(socket.playerId);
                if (playerData)                
                {
                    playerData.isTransferring = false;
                }
            });
        });
    }
}

module.exports = ServerMapManager;