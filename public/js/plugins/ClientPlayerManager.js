class ClientPlayerManager {
  constructor() {
    this.pendingJoiningCharacters = new Map(); // characterId -> characterData
    this.pendingLeavingCharacters = new Set(); // characterIds
    this.charactersOnCurrentMap = new Map(); // characterId -> characterData
    this.characterCanMove = true;
    this.processRemoteCharacters = true;
  }

  transferToMap(mapData, tileset, charactersOnMap, location) {
    window.clientAPI.dispatchToReact({
      type: "partySlice/setMember1CharacterLocation",
      payload: location,
    });
    $dataTilesets[mapData.tilesetId] = structuredClone(tileset);
    const map = structuredClone(mapData);
    map.id = Date.now();
    $dataMap = map;
    $gamePlayer.reserveTransfer(map.id, location.x, location.y, location.d, 0);
    SceneManager.goto(Scene_Map);
    this.charactersOnCurrentMap.clear();
    this.pendingJoiningCharacters = new Map(charactersOnMap);
  }

  async login(characterData) {
    const JWT = localStorage.getItem("JWT");
    window.clientAPI.authNamespace = io(
      "http://192.168.1.235:15987/authenticated",
      {
        auth: { token: JWT },
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
      },
    );
    window.clientAPI.playerManager.startListeners();

    const { mapData, tileset, charactersOnMap } =
      await window.clientAPI.authNamespace.emitWithAck("clientLoginToMap");

    DataManager.setupNewGame();

    const spritesheet =
      await window.clientAPI.spriteManager.generateBase64pngSpritesheet(
        characterData.appearance,
      );

    const bitmap = ImageManager.loadBitmapFromUrl(spritesheet);
    $gamePlayer._customBitmap = bitmap;

    this.transferToMap(
      mapData,
      tileset,
      charactersOnMap,
      characterData.location,
    );

    window.clientAPI.dispatchToReact({
      type: "RightPanelSlice/setRightPanel",
      payload: null,
    });
    window.clientAPI.dispatchToReact({
      type: "LeftPanelSlice/setLeftPanel",
      payload: "Controls",
    });
    window.clientAPI.dispatchToReact({
      type: "CenterPanelSlice/setCenterPanel",
      payload: null,
    });
    window.clientAPI.dispatchToReact({
      type: "BottomPanelSlice/setBottomPanel",
      payload: null,
    });
  }

  // Called in engine overrides
  async clientRequestMove(direction, oldLoc) {
    try {
      const { success, newLocation } =
        await window.clientAPI.authNamespace.emitWithAck(
          "clientRequestMove",
          direction,
        );
      if (!success) {
        $gamePlayer.locate(oldLoc.x, oldLoc.y);
        $gamePlayer.setDirection(oldLoc.d);
      } else {
        window.clientAPI.dispatchToReact({
          type: "partySlice/setMember1CharacterLocation",
          payload: newLocation,
        });
      }
    } catch (error) {
      console.log(error);
      $gamePlayer.locate(oldLoc.x, oldLoc.y);
      $gamePlayer.setDirection(oldLoc.d);
    }
  }

  // Called in engine overrides
  async clientRequestMapTransfer() {
    try {
      this.processRemoteCharacters = false;
      const { mapData, tileset, charactersOnMap, location } =
        await window.clientAPI.authNamespace.emitWithAck(
          "clientRequestMapTransfer",
        );
      window.clientAPI.dispatchToReact({
        type: "partySlice/setMember1CharacterLocation",
        payload: location,
      });
      this.transferToMap(mapData, tileset, charactersOnMap, location);
    } catch (error) {
      console.log(error);
    }
  }

  getNextFreeEventId() {
    if (!this._nextRemoteEventId) {
      this._nextRemoteEventId = $dataMap.events.length;
    }
    return this._nextRemoteEventId++;
  }

  async createRemotePlayer(characterId, characterData) {
    const spriteset = SceneManager._scene?._spriteset;
    if (!spriteset || !$dataMap || !$gameMap) return false;

    const eventId = this.getNextFreeEventId();
    characterData.eventId = eventId;

    const eventData = {
      id: eventId,
      name: characterData.name,
      x: characterData.location.x,
      y: characterData.location.y,
      pages: [
        {
          conditions: {
            actorValid: false,
            itemValid: false,
            selfSwitchValid: false,
            switchValid: false,
          },
          image: {
            characterName: String("$" + characterData.characterId),
            characterIndex: 0,
            direction: characterData.location.d,
            pattern: 0,
            tileId: 0,
            pattern: 1,
          },
          list: [{ code: 0, indent: 0, parameters: [] }], // empty event list, we just want the sprite
          moveFrequency: 3,
          moveSpeed: 4,
          moveType: 0,
          priorityType: 1,
          stepAnime: false,
          through: true,
          trigger: 0,
          walkAnime: true,
        },
      ],
    };
    $dataMap.events[eventId] = eventData;
    const gameEvent = new Game_Event($gameMap.mapId(), eventId);
    $gameMap._events[eventId] = gameEvent;
    const sprite = new Sprite_Character(gameEvent);
    try {
      const dataUrl =
        await window.clientAPI.spriteManager.generateBase64pngSpritesheet(
          characterData.appearance,
        );
      const bitmap = ImageManager.loadBitmapFromUrl(dataUrl);
      sprite._character._customBitmap = bitmap;
      sprite.setCharacterBitmap();
    } catch (err) {
      console.error(err);
    }
    spriteset._tilemap.addChild(sprite);
    spriteset._characterSprites.push(sprite);
  }

  deleteRemoteCharacter(characterId) {
    const spriteset = SceneManager._scene?._spriteset;
    if (!spriteset) return;

    const eventId = this.charactersOnCurrentMap.get(characterId).eventId;

    // Remove event from map
    $dataMap.events[eventId] = null;
    $gameMap._events[eventId] = null;

    // Remove sprite individually
    const spriteIndex = spriteset._characterSprites.findIndex(
      (s) => s._character._eventId === eventId,
    );
    if (spriteIndex >= 0) {
      const sprite = spriteset._characterSprites[spriteIndex];
      spriteset._tilemap.removeChild(sprite);
      spriteset._characterSprites.splice(spriteIndex, 1);
    }
  }

  async processJoiningAndLeavingCharacters() {
    for (const characterId of this.pendingLeavingCharacters) {
      if (!this.charactersOnCurrentMap.get(characterId)) continue;
      this.deleteRemoteCharacter(characterId);
      this.pendingLeavingCharacters.delete(characterId);
      this.charactersOnCurrentMap.delete(characterId);
    }

    for (const [characterId, characterData] of this.pendingJoiningCharacters) {
      await this.createRemotePlayer(characterId, characterData);
      this.pendingJoiningCharacters.delete(characterId);
      this.charactersOnCurrentMap.set(characterId, characterData);
    }
  }

  startListeners() {
    window.clientAPI.authNamespace.on(
      "serverCharacterJoinedMap",
      (characterData) => {
        this.pendingJoiningCharacters.set(
          characterData.characterId,
          characterData,
        );
      },
    );

    window.clientAPI.authNamespace.on(
      "serverCharacterLeftMap",
      (characterId) => {
        this.pendingLeavingCharacters.add(characterId);
      },
    );

    window.clientAPI.authNamespace.on(
      "serverRemoteCharacterMoved",
      ({ characterId, newLocation }) => {
        if (!this.processRemoteCharacters) return;

        const eventId = this.charactersOnCurrentMap.get(characterId)?.eventId;

        const gameEvent = $gameMap._events[eventId];
        if (!gameEvent) return;

        const startX = gameEvent.x;
        const startY = gameEvent.y;
        const targetX = newLocation.x;
        const targetY = newLocation.y;

        let x = startX;
        let y = startY;

        // Replace outdated movement path
        gameEvent._netMovementQueue = [];

        while (x !== targetX || y !== targetY) {
          if (x < targetX) {
            x++;
          } else if (x > targetX) {
            x--;
          } else if (y < targetY) {
            y++;
          } else if (y > targetY) {
            y--;
          }

          gameEvent._netMovementQueue.push({ x, y });
        }
      },
    );
  }
}

window.clientAPI.playerManager = new ClientPlayerManager();
