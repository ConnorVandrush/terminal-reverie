import fs from "fs";
import path from "path";
const __dirname = import.meta.dirname;

import Encounter from "./Encounter.js";
import Goblin from "./enemies/Goblin.js";

export default class ServerMapManager {
  constructor(serverAPI) {
    this.serverAPI = serverAPI;
    this.maps = new Map(); // mapName -> { mapData, tileset, eventData, charactersOnMap, encounters }
    this.troops = new Map();
    this.enemies = new Map();
  }

  loadTroops = () => {
    const mapFile = `../data/Troops.json`;
    const fullPath = path.resolve(__dirname, mapFile);
    const rawData = fs.readFileSync(fullPath);
    const parsedData = JSON.parse(rawData);
    for (const troop of parsedData) {
      if (!troop) continue;
      const id = troop.id;
      this.troops.set(id, troop);
    }
  };

  loadEnemies = () => {
    const mapFile = `../data/Enemies.json`;
    const fullPath = path.resolve(__dirname, mapFile);
    const rawData = fs.readFileSync(fullPath);
    const parsedData = JSON.parse(rawData);
    for (const enemy of parsedData) {
      if (!enemy) continue;
      const id = enemy.id;
      this.enemies.set(id, enemy);
    }
  };

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

        // Build encounter lookup
        const encounters = new Map();
        if (mapData.encounters) {
          for (const [regionId, regionData] of Object.entries(
            mapData.encounters,
          )) {
            encounters.set(Number(regionId), regionData);
          }
        }

        this.maps.set(mapName, {
          mapData,
          tileset: tilesets.get(mapData.tilesetId),
          eventData,
          charactersOnMap: new Map(), // characterId -> characterData
          encounters,
        });
      }
    }
  };

  serverCharacterJoinedMap(characterId, mapName, socket, cb) {
    try {
      const characterData =
        this.serverAPI.playerManager.charactersOnline.get(characterId);
      const map = this.maps.get(mapName);
      socket.join(mapName);
      cb({
        mapData: map.mapData,
        tileset: map.tileset,
        charactersOnMap: Array.from(map.charactersOnMap),
        location: characterData.location,
      });
      map.charactersOnMap.set(characterId, characterData);
      socket.to(mapName).emit("serverCharacterJoinedMap", characterData);
    } catch (error) {
      console.log(error);
      throw new Error("Failed to join map");
    }
  }

  serverCharacterLeftMap(socket, characterId, mapName) {
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

  getEventData = (mapName, x, y) => {
    const map = this.maps.get(mapName);
    if (!map) return null;

    return map.eventData.get(`${x},${y}`) || null;
  };

  getTransferDestination = (eventData) => {
    const start = eventData.name.indexOf("(") + 1;
    const end = eventData.name.indexOf(")");
    const destinationMap = eventData.name.slice(start, end);

    let transferCommand = null;
    for (const p of eventData.pages) {
      transferCommand = p.list.find((c) => c.code === 201);
      if (transferCommand) break;
    }

    const x = transferCommand?.parameters[2] ?? 0;
    const y = transferCommand?.parameters[3] ?? 0;
    const d = transferCommand?.parameters[4] ?? 2;

    const mapData = this.maps.get(destinationMap)?.mapData;
    const tileset = this.maps.get(destinationMap)?.tileset;

    return { mapData, tileset, x, y, d };
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

  getRegion = (mapName, x, y) => {
    const mapJson = this.maps.get(mapName).mapData;
    const base = 5 * mapJson.width * mapJson.height;
    const index = base + (y * mapJson.width + x);
    return mapJson.data[index];
  };

  rollEncounter(troops) {
    let roll = Math.floor(Math.random() * 100000) + 1;
    for (const troop of troops) {
      roll -= troop.percentMilleChance;

      if (roll <= 0) {
        return troop.troopId;
      }
    }
    return null;
  }

  rollForEncounter(characterData) {
    const map = this.maps.get(characterData.location.map);
    const regionId = this.getRegion(
      characterData.location.map,
      characterData.location.x,
      characterData.location.y,
    );
    const region = map.encounters.get(regionId);
    if (!region) return null;
    const roll = Math.floor(Math.random() * 100) + 1;
    if (roll >= region.encounterPercentChance) {
      return null;
    }
    return this.rollEncounter(region.troops);
  }

  serverStartEncounter(troopId, characterData) {
    const troopData = this.troops.get(troopId);
    if (!troopData) return;
    const serverEnemyData = [];
    const rmmzEnemyData = troopData.members.map((member) => {
      const enemyName = this.enemies.get(member.enemyId).name;
      const enemyInstanceId = crypto.randomUUID();
      const enemyInstance = eval(`new ${enemyName}()`);
      enemyInstance.enemyInstanceId = enemyInstanceId;
      serverEnemyData.push(enemyInstance);
      return {
        enemyInstanceId,
        member,
        enemy: this.enemies.get(member.enemyId),
      };
    });
    const reactEnemyData = Array.from({ length: 8 }, (_, index) => {
      const enemy = serverEnemyData[index];
      return enemy
        ? {
            enemyInstanceId: enemy.enemyInstanceId,
            name: enemy.name,
            maxHp: enemy.maxHp,
            currentHp: enemy.maxHp,
          }
        : null;
    });
    const partyMembers = this.serverAPI.playerManager
      .getPartyMemberData(characterData.partyMemberIds)
      .filter((m) => m != null);
    const newEncounter = new Encounter(partyMembers, serverEnemyData);
    this.serverAPI.encounterManager.activeEncounters.set(
      characterData.characterId,
      newEncounter,
    );
    newEncounter.determineTurnOrder();
    const firstTurnOrder = newEncounter.turnOrder;
    this.serverAPI.serverManager.authNamespace
      .to(characterData.partyRoom)
      .emit("serverStartEncounter", {
        troopData,
        rmmzEnemyData,
        reactEnemyData,
        firstTurnOrder,
      });
  }

  startListeners() {
    this.serverAPI.serverManager.authNamespace.on("connection", (socket) => {
      socket.on("clientLoginToMap", async (cb) => {
        try {
          const characterData =
            this.serverAPI.playerManager.charactersOnline.get(
              socket.characterId,
            );
          this.serverCharacterJoinedMap(
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
          if (!characterData.canMove || !characterData.canTransfer) {
            return cb({
              success: false,
            });
          }
          characterData.canMove = false;
          const result = this.canCharacterMove(characterData, direction);
          if (!result.success) {
            cb({ success: false });
          } else {
            if (characterData.partyMemberIds.length === 1) {
              characterData.location = result.newLocation;
              this.serverAPI.serverManager.authNamespace
                .to(characterData.location.map)
                .except(socket.id)
                .emit("serverRemoteCharacterMoved", {
                  characterId: characterData.characterId,
                  newLocation: result.newLocation,
                });
            } else {
              const partyMembers = characterData.partyMemberIds.map((id) =>
                this.serverAPI.playerManager.charactersOnline.get(id),
              );
              const oldLocations = partyMembers.map((member) => ({
                ...member.location,
              }));
              partyMembers[0].location = result.newLocation;
              for (let i = 1; i < partyMembers.length; i++) {
                partyMembers[i].location = oldLocations[i - 1];
              }
              const leaderId = partyMembers[0].characterId;
              for (const member of partyMembers) {
                const room = this.serverAPI.serverManager.authNamespace.to(
                  member.location.map,
                );

                room.emit("serverRemoteCharacterMoved", {
                  characterId: member.characterId,
                  newLocation: member.location,
                });
              }
            }
            cb({ success: true, newLocation: result.newLocation });
          }
          const troopId = this.rollForEncounter(characterData);
          if (troopId) {
            this.serverStartEncounter(troopId, characterData);
            return;
          } else {
            setTimeout(() => (characterData.canMove = true), 50);
          } // simple movement rate limit
        } catch (error) {
          console.log(error);
          cb({ error: error.message });
        }
      });

      socket.on("clientRequestMapTransfer", async (cb) => {
        const characterData = this.serverAPI.playerManager.charactersOnline.get(
          socket.characterId,
        );
        if (!characterData.canTransfer) cb({ success: false });
        if (
          characterData.partyMemberIds.length > 1 &&
          characterData.partyMemberIds[0] === socket.characterId
        )
          this.serverAPI.playerManager.assembleParty(socket.characterId);
        characterData.canTransfer = false;
        const location = characterData.location;
        const eventData = this.getEventData(
          location.map,
          location.x,
          location.y,
        );
        if (!eventData) return cb({ success: false });
        if (eventData.name.startsWith("Transfer")) {
          const { mapData, tileset, x, y, d } =
            this.getTransferDestination(eventData);
          this.serverCharacterLeftMap(socket, socket.characterId, location.map);
          characterData.location = { x, y, d, map: mapData.displayName };
          this.serverCharacterJoinedMap(
            socket.characterId,
            mapData.displayName,
            socket,
            cb,
          );
        }
      });

      socket.on("clientMapTransferComplete", async (cb) => {
        const characterData = this.serverAPI.playerManager.charactersOnline.get(
          socket.characterId,
        );
        characterData.canTransfer = true;
      });

      socket.on("clientSendChatMessage", (message) => {
        try {
          const characterData =
            this.serverAPI.playerManager.charactersOnline.get(
              socket.characterId,
            );
          const map = characterData?.location?.map;
          if (characterData && map) {
            this.serverAPI.serverManager.authNamespace
              .to(map)
              .emit("serverBroadcastChatMessage", {
                message,
                sender: characterData.name,
              });
          }
        } catch (error) {
          console.log(error);
        }
      });
    });
  }
}
