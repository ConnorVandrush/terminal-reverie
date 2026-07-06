import fs from "fs";

export default class ServerMapManager {
  constructor(api) {
    this.api = api;
    this.maps = new Map(); // mapName -> { mapData, tileset, eventData, charactersOnMap }
  }

  loadMaps = () => {
    // Load tilesets
    const tilesets = new Map();
    const tilesetData = JSON.parse(
      fs.readFileSync("./server/data/maps/Tilesets.json", "utf-8"),
    );

    for (const tileset of tilesetData) {
      if (!tileset) continue;
      tilesets.set(tileset.id, tileset);
    }

    const basePath = "./server/data/maps";
    const mapDirectories = fs.readdirSync(basePath);

    for (const dir of mapDirectories) {
      const dirPath = `${basePath}/${dir}`;

      if (!fs.lstatSync(dirPath).isDirectory()) continue;

      // Read all JSON files inside this map directory
      const files = fs.readdirSync(dirPath);

      for (const file of files) {
        if (!file.endsWith(".json")) continue;
        if (file === "Tilesets.json") continue;

        const mapName = file.replace(".json", "");
        const mapPath = `${dirPath}/${file}`;

        const mapData = JSON.parse(fs.readFileSync(mapPath, "utf-8"));

        // Build event lookup
        const eventData = new Map();
        for (const event of mapData.events) {
          if (!event) continue;
          eventData.set(`${event.x},${event.y}`, event);
        }

        this.maps.set(mapName, {
          mapData,
          tileset: tilesets.get(mapData.tilesetId),
          eventData,
          charactersOnMap: new Map(), // characterId -> characterData
        });
      }
    }
  };

  characterJoinMap(socket, characterId, mapName, cb) {
    try {
      const characterData =
        this.api.playerManager.charactersOnline.get(characterId);
      const map = this.maps.get(mapName);
      map.charactersOnMap.set(characterId, characterData);
      socket.join(mapName);
      cb({
        mapData: map.mapData,
        tileset: map.tileset,
        eventData: Array.from(map.eventData),
        charactersOnMap: Array.from(map.charactersOnMap),
      });
      socket.to(mapName).emit("serverNewCharacterJoinedMap", { characterData });
    } catch (error) {
      console.log(`Character ID ${characterId} failed to join map ${mapName}`);
      return cb({ error: "Failed to join map." });
    }
  }

  characterLeaveMap(socket, characterId, mapName) {
    try {
      socket.leave(mapName);
      const map = this.maps.get(mapName);
      map.charactersOnMap.delete(characterId);
      socket.to(mapName).emit("serverCharacterLeftMap", characterId);
    } catch (error) {
      console.log(`Character ID ${characterId} failed to leave map ${mapName}`);
    }
  }
}
