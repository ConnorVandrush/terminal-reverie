const fs = require('fs');
const path = require('path');
const encounter = require('./Encounter.js');
const { createEnemy } = require('./Enemies/EnemyRegistry.js');

class ServerEncounterManager 
{
    constructor(io, serverPartyManager)
    {
        this.io = io;
        this.serverPartyManager = serverPartyManager;
        this.troops = new Map();
        this.enemies = new Map();
        this.encounterTables = new Map();
        this.ongoingEncounters = new Map(); // playerId -> Encounter instance
    }

    randInt(min, max) 
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    loadTroops = () =>
    {
        const mapFile = `../data/Troops.json`;
        const fullPath = path.resolve(__dirname, mapFile);
        const rawData = fs.readFileSync(fullPath);
        const parsedData = JSON.parse(rawData);
        for (const troop of parsedData) 
        {
            if (!troop) continue;
            const id = troop.id;
            this.troops.set(id, troop);
        }
    }

    loadEnemies = () =>
    {
        const mapFile = `../data/Enemies.json`;
        const fullPath = path.resolve(__dirname, mapFile);
        const rawData = fs.readFileSync(fullPath);
        const parsedData = JSON.parse(rawData);
        for (const enemy of parsedData) 
        {
            if (!enemy) continue;
            const id = enemy.id;
            this.enemies.set(id, enemy);
        }
    }

    loadEncounterTables = () =>
    {
        const mapFile = `../data/EncounterTables.json`;
        const fullPath = path.resolve(__dirname, mapFile);
        const rawData = fs.readFileSync(fullPath);
        const parsedData = JSON.parse(rawData);

        for (const [mapName, encounterTable] of Object.entries(parsedData)) 
        {
            if (!encounterTable) continue;
            this.encounterTables.set(mapName, encounterTable);
        }
    }

    rollForEncounter(mapName, region, battleback, playerData)
    {
        const encounterTable = this.encounterTables.get(mapName);
        const regionTable = encounterTable?.[String(region)];

        if (!regionTable) 
        {
            return null;
        }

        if (this.randInt(1, 100) < regionTable.encounterChance)
        {
            const entries = Object.values(regionTable).filter(e => typeof e === "object" && e.weight);

            const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
            let random = Math.floor(Math.random() * totalWeight);

            for (const entry of entries) 
            {
                random -= entry.weight;
                if (random < 0) 
                {
                    const troopData = this.troops.get(entry.troopId);
                    if (!playerData.inEncounter)
                    {
                        playerData.inEncounter = true;
                        let allyList;
                        let encounterRoom;
                        if (this.serverPartyManager.playerParties.has(playerData.playerId))
                        {
                            allyList = this.serverPartyManager.playerParties.get(playerData.playerId).members.map(member => member.characterData);
                            encounterRoom = `party_${this.serverPartyManager.getPartyLeaderId(playerData.playerId)}`;
                        }
                        else
                        {
                            allyList = [playerData.characterData];
                            encounterRoom = playerData.socketId;
                        }
                        let enemyList;
                        for (const member of troopData.members)
                        {
                            const enemyInfo = this.enemies.get(member.enemyId);
                            if (enemyInfo)                            
                            {
                                const enemyInstance = createEnemy(enemyInfo.name);
                                enemyList = enemyList || [];
                                enemyList.push(enemyInstance);
                            }
                        }
                        const newEncounter = new encounter(this, allyList, enemyList, encounterRoom);
                        this.ongoingEncounters.set(playerData.characterData.playerId, newEncounter);
                        return {
                            troopData,
                            enemyData: troopData.members.map(member => this.enemies.get(member.enemyId)),
                            battleback
                        };
                    }
                }
            }
        }

        return null;
    }

    startListeners = () =>
    {
        this.io.on('connection', (socket) =>
        {
            socket.on('clientAllyTurn', (allyTurnData) =>
            {
                const thisEncounter = this.ongoingEncounters.get(socket.playerId);
                const playerData = this.serverPartyManager.serverPlayerManager.playersOnline.get(socket.playerId);
                allyTurnData.characterData = playerData.characterData;
                thisEncounter.processTurn(allyTurnData);
            });
        });
    }

    broadcastTurnResults(encounterRoom, allyTurnResults, enemyTurnResults)
    {
        this.io.to(encounterRoom).emit('serverTurnResults', allyTurnResults, enemyTurnResults);
    }
}

module.exports = ServerEncounterManager;