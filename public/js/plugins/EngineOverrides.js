// Move the RPG Maker canvas into a stable wrapper element
const _Graphics_createCanvas = Graphics._createCanvas;
Graphics._createCanvas = function() {
    // Let RPG Maker do all its normal setup
    _Graphics_createCanvas.call(this);

    // Then move the canvas into a stable wrapper
    const wrapper = document.getElementById("gamePanel");
    if (wrapper && this._canvas && this._canvas.parentNode !== wrapper) {
        wrapper.appendChild(this._canvas);
    }
};

// Hide title screen commands to prevent starting a new game or loading a save
const _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
Scene_Title.prototype.createCommandWindow = function() {
    _Scene_Title_createCommandWindow.call(this);

    // Optional: hide window completely
    this._commandWindow.hide();
};

// Override DataManager.loadMapData to prevent loading maps from disk because we inject the MMO map directly into $dataMap.
DataManager.loadMapData = function(mapId) {
    if ($dataMap && $dataMap.id === mapId) {
        // MMO map already injected — do NOT load from disk
        return;
    }
    
    _DataManager_loadMapData.call(this, mapId);
};

//Override ImageManager.loadCharacter to prevent loading character sprites from disk, since we will be injecting recolored sprites directly into $gamePlayer._customBitmap.
const _loadCharacter = ImageManager.loadCharacter;
ImageManager.loadCharacter = function(filename) {
    if (filename.startsWith("$")) {
        return $gamePlayer._customBitmap; // FIXME This is the player's custom bitmap, might have to do something else to find remote player bitmaps
    }
    return _loadCharacter.call(this, filename);
};

// Override Sprite_Character to use the custom bitmap if it exists
const _setBitmap = Sprite_Character.prototype.setCharacterBitmap;
Sprite_Character.prototype.setCharacterBitmap = function(character) {
    if (character && character._customBitmap) {
        this.bitmap = character._customBitmap;
    } else {
        _setBitmap.call(this, character);
    }
};

// Client-side movement with server reconciliation and client prediction
Game_Player.prototype.moveByInput = async function (reactDirection) 
{
    const mapManager = window.clientGlobalManager.clientMapManager;
    const direction = reactDirection ?? Input.dir4;
    
    if (direction <= 0 || mapManager.isMoving || window.isPartyFollower) return;
    
    mapManager.isMoving = true;
    
    const oldLoc = {x: this.x, y: this.y, d: direction};
    
    // Solo movement with client prediction
    if (!window.isPartyLeader && !window.isPartyFollower)
    {
        this.moveStraight(direction);
        mapManager.requestMove(direction, oldLoc);
    }

    // // Party movement
    // if (window.isPartyLeader) 
    // {
    //     // Server will move all party members at once
    //     mapManager.requestMove(this, direction, oldLoc);
    // }
};