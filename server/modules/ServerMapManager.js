const { current } = require('@reduxjs/toolkit');
const fs = require('fs');

class ServerMapManager
{
    constructor(io, serverPlayerManager, serverPartyManager, serverEncounterManager)
    {
        this.io = io;
        this.serverPlayerManager = serverPlayerManager;
        this.serverPartyManager = serverPartyManager;
        this.serverEncounterManager = serverEncounterManager;
        this.maps = new Map(); // mapName -> { mapData, tileset, eventData }
    }

    loadMaps = () =>
    {
        // Load tilesets
        const tilesets = new Map();
        const tilesetData = JSON.parse(fs.readFileSync('./server/data/maps/Tilesets.json', 'utf-8'));

        for (const tileset of tilesetData) 
        {
            if (!tileset) continue;
            tilesets.set(tileset.id, tileset);
        }

        const basePath = './server/data/maps';
        const mapDirectories = fs.readdirSync(basePath);

        for (const dir of mapDirectories) 
        {
            const dirPath = `${basePath}/${dir}`;

            if (!fs.lstatSync(dirPath).isDirectory()) continue;

            // Read all JSON files inside this map directory
            const files = fs.readdirSync(dirPath);

            for (const file of files) 
            {
                if (!file.endsWith('.json')) continue;
                if (file === 'Tilesets.json') continue;

                const mapName = file.replace('.json', '');
                const mapPath = `${dirPath}/${file}`;

                const mapData = JSON.parse(fs.readFileSync(mapPath, 'utf-8'));

                // Build event lookup
                const eventData = new Map();
                for (const event of mapData.events) 
                {
                    if (!event) continue;
                    eventData.set(`${event.x},${event.y}`, event);
                }

                this.maps.set(mapName, 
                {
                    mapData,
                    tileset: tilesets.get(mapData.tilesetId),
                    eventData
                });
            }
        }
    };

    getRegion = (mapName, x, y) =>
    {
        const mapJson = this.maps.get(mapName).mapData;
        const base = 5 * mapJson.width * mapJson.height;
        const index = base + (y * mapJson.width + x);
        return mapJson.data[index];
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

    canMove(playerData, direction, newLocation, currentLoc)
    {
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
            return { success: false };
        }

        // check entering destination tile
        if (!this.isPassable(newLocation.map, newLocation.x, newLocation.y, reverseDir[direction])) 
        {
            return { success: false };
        }

        newLocation.d = direction;
        return { success: true, newLocation };
    }

    startListeners = () =>
    {
        this.io.on('connection', (socket) =>
        {
            socket.on('clientPlayerMove', async (direction, cb) =>
            {
                const playerData = this.serverPlayerManager.playersOnline.get(socket.playerId);
                playerData.characterData.location.d = direction;

                if (!playerData || playerData.isTransferring || playerData.preventMovement || playerData.inEncounter)
                {
                    return cb({ success: false });
                }
                playerData.preventMovement = true;
                setTimeout(() => playerData.preventMovement = false, 50); // simple movement rate limit

                let newLocation;
                const currentLoc = playerData.characterData.location;
                const result = this.canMove(playerData, direction, newLocation, currentLoc);
                if (!result.success) 
                {
                    return cb({ success: false });
                }
                playerData.characterData.location = result.newLocation;
                const encounter = await this.serverEncounterManager.rollForEncounter(currentLoc.map, this.getRegion(currentLoc.map, result.newLocation.x, result.newLocation.y), this.maps.get(currentLoc.map).mapData.battleback1Name, playerData);
                this.io.to(currentLoc.map).except(socket.id).emit('serverPlayerMoved', { playerId: socket.playerId, newLocation: result.newLocation, inEncounter: playerData.inEncounter });
                return cb({ success: true, newLocation: result.newLocation, encounter });
            });

            socket.on('clientPartyMove', async (direction) =>
            {
                const leaderData = this.serverPlayerManager.playersOnline.get(socket.playerId);
                if (!leaderData || leaderData.isTransferring || leaderData.preventMovement || leaderData.inEncounter)                
                {
                    return;
                }
                leaderData.preventMovement = true;
                setTimeout(() => leaderData.preventMovement = false, 50); // simple movement rate limit

                const partyData = this.serverPartyManager.playerParties.get(socket.playerId);
                if (!partyData) return;
                
                let newLocation;
                const currentLoc = leaderData.characterData.location;
                const result = this.canMove(leaderData, direction, newLocation, currentLoc);
                if (!result.success) 
                {
                    return;
                }

                const oldPositions = new Map();
                for (const member of partyData.members)
                {
                    const memberData = this.serverPlayerManager.playersOnline.get(member.playerId);
                    oldPositions.set(member.playerId, { ...memberData.characterData.location });
                }
                for (let i = 0; i < partyData.members.length; i++)
                {
                    const currentMember = partyData.members[i];
                    const previousMember = partyData.members[i - 1];

                    const memberData = this.serverPlayerManager.playersOnline.get(currentMember.playerId);

                    if (i === 0)
                    {
                        memberData.characterData.location = oldPositions.get(leaderData.playerId);
                    }
                    else
                    {
                        memberData.characterData.location = oldPositions.get(previousMember.playerId);
                    }
                }

                leaderData.characterData.location = result.newLocation;

                const newLocations = partyData.members.map(member => 
                {
                    const memberData = this.serverPlayerManager.playersOnline.get(member.playerId);
                    return { playerId: member.playerId, newLocation: memberData.characterData.location };
                });

                this.io.to(leaderData.characterData.location.map).emit('serverPartyMoved', newLocations );
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

                    if (this.serverPartyManager.playerParties.has(socket.playerId))
                    {
                        this.io.to('party_' + socket.playerId).emit('serverUpdatePartyData', this.serverPartyManager.playerParties.get(socket.playerId));
                    }

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