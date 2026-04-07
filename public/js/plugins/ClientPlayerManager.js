class ClientPlayerManager
{
    constructor()
    {
        this.gamePlayer = null;
        this.publicNamespace = null;
        this.socket = null;
        this.spriteColorer = null;
        this.characterData = null;
        this.playersOnMap = new Map(); // playerId -> { characterData, eventId }
        this.customBitmaps = new Map(); // playerId -> bitmap
        this.pendingRemotePlayers = new Map();
        this.pendingRemotePlayerDisconnects = new Set();
    }

    async login(characterData, { mapData, tileset }, playersOnMap)
    {
        const JWT = localStorage.getItem('JWT');
        if (!JWT) return null;

        window.clientGlobalManager.clientPlayerManager.socket = io(window.clientGlobalManager.SERVER_CONFIG.IO_URL, 
        {
            auth: { JWT },
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
        });
        this.startListeners();
        window.clientGlobalManager.clientMapManager.startListeners();
        window.clientGlobalManager.clientPartyManager.startListeners();
        window.clientGlobalManager.clientEncounterManager.startListeners();
        
        DataManager.setupNewGame();
        this.characterData = characterData;
        window.clientGlobalManager.clientPartyManager.partyData = { members: [this.characterData] };
        this.pendingRemotePlayers = new Map(playersOnMap);
        
        const appearance = await this.spriteColorer.recolorSpritesheet('/img/characters/$' + characterData.appearance.template + '.png', characterData.appearance.template, characterData.appearance.colors);
        const bitmap = ImageManager.loadBitmapFromUrl(appearance);
        $gamePlayer._customBitmap = bitmap;
        window.clientGlobalManager.clientPlayerManager.customBitmaps.set(String('$' + characterData.playerId), bitmap);
        $gameActors.actor(1).setCharacterImage(String('$' +characterData.playerId), 0);
        
        $dataTilesets[mapData.tilesetId] = structuredClone(tileset);
        const map = structuredClone(mapData);
        map.id = Date.now(); // Unique ID forces reload, if we reuse the same map id it doesn't load properly
        $dataMap = map;

        $gameParty.gainGold(characterData.gold);
        $gamePlayer.reserveTransfer(map.id, characterData.location.x, characterData.location.y, characterData.location.d, 0);
        this.gamePlayer = $gamePlayer;
        AudioManager.stopBgm();
        SceneManager.goto(Scene_Map);
    }

    processPendingPlayerChanges()
    {
        const spriteset = SceneManager._scene?._spriteset;
        if (!spriteset) return;

        // --- Handle disconnects ---
        for (const playerId of this.pendingRemotePlayerDisconnects) 
        {
            if (!this.playersOnMap.get(playerId)) continue; // already removed, possibly due to map transfer
            const eventId = this.playersOnMap.get(playerId).eventId;
            if (!eventId) continue;

            // Remove event from map
            $dataMap.events[eventId] = null;
            $gameMap._events[eventId] = null;

            // Remove sprite individually
            const spriteIndex = spriteset._characterSprites.findIndex(s => s._character._eventId === eventId);
            if (spriteIndex >= 0) 
            {
                const sprite = spriteset._characterSprites[spriteIndex];
                spriteset._tilemap.removeChild(sprite);
                spriteset._characterSprites.splice(spriteIndex, 1);
            }

            this.playersOnMap.delete(playerId);
            this.pendingRemotePlayerDisconnects.delete(playerId);
        }

        // --- Handle new players ---
        for (const [playerId, characterData] of this.pendingRemotePlayers) 
        {
            if (playerId == this.characterData.playerId)
            {
                this.pendingRemotePlayers.delete(playerId);
                continue;
            }
            this.createRemotePlayer(playerId, characterData);
            this.pendingRemotePlayers.delete(playerId);
        }
    }

    getNextFreeEventId() 
    {
        if (!this._nextRemoteEventId) 
        {
            this._nextRemoteEventId = $dataMap.events.length;
        }
        return this._nextRemoteEventId++;
    }

    createRemotePlayer(playerId, characterData)
    {
        if (!SceneManager._scene?._spriteset) return;

        const eventId = this.getNextFreeEventId();

        const eventData = 
        {
            id: eventId,
            name: characterData.name,
            x: characterData.location.x,
            y: characterData.location.y,
            pages: 
            [{
                conditions: { actorValid: false, itemValid: false, selfSwitchValid: false, switchValid: false },
                image: { characterName: String('$' + characterData.playerId), characterIndex: 0, direction: characterData.location.d, pattern: 0, tileId: 0, pattern: 1},
                list: [{ code: 0, indent: 0, parameters: [] }], // empty event list, we just want the sprite
                moveFrequency: 3,
                moveSpeed: 4,
                moveType: 0,
                priorityType: 1,
                stepAnime: false,
                through: true,
                trigger: 0,
                walkAnime: true
            }]
        };

        $dataMap.events[eventId] = eventData;
        const gameEvent = new Game_Event($gameMap.mapId(), eventId);
        $gameMap._events[eventId] = gameEvent;
        this.playersOnMap.set(playerId, { characterData, eventId });
        const sprite = new Sprite_Character(gameEvent);
        this.spriteColorer.recolorSpritesheet('/img/characters/$' + characterData.appearance.template + '.png', characterData.appearance.template, characterData.appearance.colors)
        .then(recolored => 
        {
            const bitmap = ImageManager.loadBitmapFromUrl(recolored);
            window.clientGlobalManager.clientPlayerManager.customBitmaps.set(String('$' + characterData.playerId), bitmap);
            sprite._character._customBitmap = bitmap;
            sprite.setCharacterBitmap();
        });
        
        SceneManager._scene._spriteset._tilemap.addChild(sprite);
        SceneManager._scene._spriteset._characterSprites.push(sprite);
    }

    startListeners()
    {
        this.socket.on('serverPlayerJoinedMap', ({playerId, characterData}) =>
        {
            this.pendingRemotePlayers.set(playerId, characterData);
        });

        this.socket.on('serverPlayerLeftMap', (playerId) =>
        {
            this.pendingRemotePlayerDisconnects.add(playerId);
        });
    }
}

window.clientGlobalManager.clientPlayerManager = new ClientPlayerManager();

