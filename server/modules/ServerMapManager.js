const fs = require('fs');

class ServerMapManager
{
    constructor()
    {
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
            this.maps.set(mapName, {mapData, tileset: tilesets.get(mapData.tilesetId)});
        }
    }

}

module.exports = ServerMapManager;