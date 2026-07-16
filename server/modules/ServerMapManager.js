import fs from "fs";

export default class ServerMapManager {
  constructor(serverAPI) {
    this.serverAPI = serverAPI;
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
        this.serverAPI.playerManager.charactersOnline.get(characterId);
      const map = this.maps.get(mapName);
      map.charactersOnMap.set(characterId, characterData);
      socket.join(mapName);
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

  directionBit(direction) {
    switch (direction) {
      case 2:
        return 1; // down
      case 4:
        return 2; // left
      case 6:
        return 4; // right
      case 8:
        return 8; // up
      default:
        return 0;
    }
  }

  layeredTiles = (mapData, x, y) => {
    const width = mapData.width;
    const height = mapData.height;
    const data = mapData.data;

    const tiles = [];
    for (let z = 0; z < 4; z++) {
      const index = z * width * height + (y * width + x);
      tiles.push(data[index]);
    }
    return tiles;
  };

  isEventBlocking(mapName, x, y) {
    // Such as NPCs
    const event = this.maps.get(mapName)?.eventData.get(`${x},${y}`);
    if (!event) return false;

    const page = event.pages[0]; // TODO: resolve active page properly
    if (!page) return false;

    const priority = page.priorityType; // 0 = below, 1 = same, 2 = above
    const through = page.through;

    return priority === 1 && !through;
  }

  isTilePassable = (mapName, x, y, direction) => {
    if (!this.maps.has(mapName)) return false;

    const { mapData, tileset, eventData } = this.maps.get(mapName);
    if (!mapData) return false;
    const bit = this.directionBit(direction);
    const flags = tileset.flags;

    if (x < 0 || y < 0 || x >= mapData.width || y >= mapData.height)
      return false;

    if (this.isEventBlocking(mapName, x, y)) {
      return false;
    }

    const tiles = this.layeredTiles(mapData, x, y);
    for (const tileId of tiles) {
      const flag = flags[tileId];

      if (flag & 0x10) continue; // star tile → ignore
      if ((flag & bit) === 0) return true; // passable
      if ((flag & bit) === bit) return false; // blocked
    }

    return false;
  };

  canCharacterMove(characterData, direction) {
    const currentLoc = characterData.location;
    let newLocation = {};
    switch (direction) {
      case 2:
        newLocation = {
          ...characterData.location,
          y: characterData.location.y + 1,
        };
        break; // down
      case 4:
        newLocation = {
          ...characterData.location,
          x: characterData.location.x - 1,
        };
        break; // left
      case 6:
        newLocation = {
          ...characterData.location,
          x: characterData.location.x + 1,
        };
        break; // right
      case 8:
        newLocation = {
          ...characterData.location,
          y: characterData.location.y - 1,
        };
        break; // up
    }

    const reverseDir = { 2: 8, 4: 6, 6: 4, 8: 2 };

    // check leaving current tile
    if (
      !this.isTilePassable(
        currentLoc.map,
        currentLoc.x,
        currentLoc.y,
        direction,
      )
    ) {
      return { success: false };
    }

    // check entering destination tile
    if (
      !this.isTilePassable(
        newLocation.map,
        newLocation.x,
        newLocation.y,
        reverseDir[direction],
      )
    ) {
      return { success: false };
    }

    newLocation.d = direction;
    return { success: true, newLocation };
  }

  startListeners() {
    this.serverAPI.serverManager.authNamespace.on("connection", (socket) => {
      socket.on("clientLoginToMap", async (cb) => {
        try {
          const characterData =
            this.serverAPI.playerManager.charactersOnline.get(
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

      socket.on("clientRequestMove", async (direction, cb) => {
        try {
          const characterData =
            this.serverAPI.playerManager.charactersOnline.get(
              socket.characterId,
            );
          if (!characterData.canMove) {
            return cb({
              success: false,
            });
          }
          characterData.canMove = false;
          const result = this.canCharacterMove(characterData, direction);
          if (!result.success) {
            cb({ success: false });
          } else {
            characterData.location = result.newLocation;
            cb({ success: true, newLocation: result.newLocation });
          }
          setTimeout(() => (characterData.canMove = true), 50); // simple movement rate limit
        } catch (error) {
          console.log(error);
          cb({ error: error.message });
        }
      });
    });
  }
}
