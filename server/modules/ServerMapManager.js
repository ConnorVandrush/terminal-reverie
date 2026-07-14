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

  characterJoinMap(characterId, mapName, socket, cb) {
    try {
      const characterData =
        this.api.playerManager.charactersOnline.get(characterId);
      const map = this.maps.get(mapName);
      console.log(map);
      console.log("helo");
      map.charactersOnMap.set(characterId, characterData);
      socket.join(mapName);
      console.log(map.mapData);
      console.log(map.tileset);
      cb({
        mapData: map.mapData,
        tileset: map.tileset,
        charactersOnMap: Array.from(map.charactersOnMap),
      });
      socket.to(mapName).emit("serverNewCharacterJoinedMap", { characterData });
    } catch (error) {
      console.log(error);
      throw new Error("Failed to join map");
    }
  }

  characterLeaveMap(socket, characterId, mapName) {
    try {
      socket.leave(mapName);
      const map = this.maps.get(mapName);
      map.charactersOnMap.delete(characterId);
      socket.to(mapName).emit("serverCharacterLeftMap", characterId);
    } catch (error) {
      console.log(error);
      throw new Error("Failed to leave map");
    }
  }

  startListeners() {
    this.api.serverManager.authNamespace.on("connection", (socket) => {
      socket.on("clientLoginToMap", async (cb) => {
        try {
          const characterData = this.api.playerManager.charactersOnline.get(
            socket.characterId,
          );
          this.characterJoinMap(
            characterData.characterId,
            characterData.location.map,
            socket,
            cb,
          );
        } catch (error) {
          console.log(error);
          cb({ error: error.message });
        }
      });
    });
  }
}
