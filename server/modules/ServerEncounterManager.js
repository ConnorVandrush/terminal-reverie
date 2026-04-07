const fs = require('fs');
const path = require('path');

class ServerEncounterManager 
{
    constructor()
    {
        this.troops = new Map();
        this.enemies = new Map();
        this.encounterTables = new Map();
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
    }
}

module.exports = ServerEncounterManager;