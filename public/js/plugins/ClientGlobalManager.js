class ClientGlobalManager 
{
    constructor()
    {
        this.publicNamespace = null;
        this.socket = null;
        this.clientInputManager = null;
        this.refreshTokenTimeout = null;
        this.spriteColorer = null;
        this.characterData = null;
        this.clientMapManager = null;

        Game_Character.prototype.setCharacterBitmap = function(bitmap) 
        {
            this._customBitmap = bitmap;
            this._characterName = "";
            this._characterIndex = 0;
        };
    }

    async login(characterData, { mapData, tileset })
    {
        const JWT = localStorage.getItem('JWT');
        if (!JWT) return null;

        this.socket = io('http://localhost:15987', 
        {
            auth: { JWT },
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
        });

        DataManager.setupNewGame();
        this.characterData = characterData;
        
        const appearance = await this.spriteColorer.recolorSpritesheet('/img/characters/$' + characterData.appearance.template + '.png', characterData.appearance.template, characterData.appearance.colors);
        const bitmap = ImageManager.loadBitmapFromUrl(appearance);
        $gamePlayer.setCharacterBitmap(bitmap);
        $gamePlayer.refresh();
        
        $dataTilesets[mapData.tilesetId] = structuredClone(tileset);
        const map = structuredClone(mapData);
        map.id = Date.now(); // Unique ID forces reload, if we reuse the same map id it doesn't load properly
        $dataMap = map;

        $gameParty.gainGold(characterData.gold);
        $gamePlayer.reserveTransfer(map.id, characterData.location.x, characterData.location.y);
        SceneManager.goto(Scene_Map);
    }
}

window.clientGlobalManager = new ClientGlobalManager();