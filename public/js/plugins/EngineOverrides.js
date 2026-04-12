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

// Override Game_Interpreter command 201 (Transfer Player) to use MMO transfer
const _command201 = Game_Interpreter.prototype.command201;
Game_Interpreter.prototype.command201 = function() 
{
    window.clientGlobalManager.clientMapManager.requestMapTransfer();
    return true;
};

// Override Sprite_Character to use the custom bitmap if it exists
const _setBitmap = Sprite_Character.prototype.setCharacterBitmap;
Sprite_Character.prototype.setCharacterBitmap = function() {
    const character = this._character;

    if (character && character._customBitmap) {
        this.bitmap = character._customBitmap;
        this._isBigCharacter = true;
    } else {
        _setBitmap.call(this);
    }
};
// Override ImageManager.loadCharacter to prevent loading character sprites from disk, we handle this ourselves in ClientPlayerManager when we recolor the spritesheet and create a custom bitmap for the player.
const _loadCharacter = ImageManager.loadCharacter;
ImageManager.loadCharacter = function(filename) {
    // Disable loading when filename is empty OR starts with "$"
    if (!filename || filename.startsWith("$")) {
        return new Bitmap(0, 0);
    }
    return _loadCharacter.call(this, filename);
};
//SceneManager._scene._spriteset._characterSprites

// Disable all dashing in RMMZ
const _Game_Player_isDashing = Game_Player.prototype.isDashing;
Game_Player.prototype.isDashing = function() {
    return false;
};

// Client-side movement with server reconciliation and client prediction
Game_Player.prototype.moveByInput = async function (reactDirection) 
{
    const mapManager = window.clientGlobalManager.clientMapManager;
    const partyManager = window.clientGlobalManager.clientPartyManager;
    const direction = reactDirection ?? Input.dir4;
    
    if (direction <= 0 || mapManager.isMoving || partyManager.isPartyFollower) return;

    // Party movement
    if (partyManager.isPartyLeader && !mapManager.isMoving)
    {
        mapManager.isMoving = true;
        partyManager.requestPartyMove(direction);
        setTimeout(() => mapManager.waitForMovementEnd($gamePlayer), 50); // FIXME isMoving is being set to false too early, this is a band-aid to prevent desync but the root cause should be fixed. Maybe add prediction for party movement as well?
    }

    // Solo movement with client prediction
    if (!partyManager.isPartyLeader && !partyManager.isPartyFollower)
    {
        mapManager.isMoving = true;
        const oldLoc = {x: this.x, y: this.y, d: direction};
        this.moveStraight(direction);
        mapManager.requestMove(direction, oldLoc);
    }
};

// Extend Game_Event and Game_Player to handle networked movement
const _Game_Event_update = Game_Event.prototype.update;
Game_Event.prototype.update = function() {
    _Game_Event_update.call(this);
    this.updateNetMovement();
};
const _Game_Player_update = Game_Player.prototype.update;
Game_Player.prototype.update = function(sceneActive) {
    _Game_Player_update.call(this, sceneActive);
    this.updateNetMovement();
};
Game_CharacterBase.prototype.updateNetMovement = function() {
    if (!this._netMovementQueue || this._netMovementQueue.length === 0 || this.isMoving()) return;
    const next = this._netMovementQueue.shift();
    const dir = this.findDirectionTo(next.x, next.y);
    this.moveStraight(dir);
};

// Save original SceneManager.pop function, it's disabled during battles
window._pop = SceneManager.pop;
// Hook into Scene_Map to create remote players when the map is loaded
const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
    _Scene_Map_onMapLoaded.call(this);
    window.rmmzPlayer = $gamePlayer;
    SceneManager.pop = window._pop;

    window.clientGlobalManager.clientPlayerManager.socket.emit('clientMapTransferComplete');
    window.clientGlobalManager.clientMapManager.isTransferring = false;
    window.clientGlobalManager.clientMapManager.isMoving = false;
    for (const [playerId, player] of window.clientGlobalManager.clientPlayerManager.playersOnMap.entries()) 
    {
        // enqueue for creation
        window.clientGlobalManager.clientPlayerManager.pendingRemotePlayers.set(playerId, { characterData: player.characterData, });
    }

    window.clientGlobalManager.clientPlayerManager.processPendingPlayerChanges();
};

// Look for pending player changes (new players, disconnects) on each update and process them
const _Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    _Scene_Map_update.call(this);   // correct `this`

    // your logic
    if (window.clientGlobalManager?.clientMapManager.isTransferring) return; // don't process pending changes during transfer
    window.clientGlobalManager.clientPlayerManager.processPendingPlayerChanges();
};

// Disable default battle windows
const rect = new Rectangle(0, 0, 0, 0);
Scene_Battle.prototype.createStatusWindow = function() {
    this._statusWindow = new Window_BattleStatus(rect);
    this._statusWindow.visible = false;
    this._statusWindow.openness = 0;
    this.addWindow(this._statusWindow);
};
Game_Troop.prototype.enemyNames = function() {
    return []; // return no names → no message
};
Scene_Battle.prototype.createBattleLogWindow = function() {
    this._battleLogWindow = new Window_BattleLog(rect);
    this._battleLogWindow.visible = false;
    this._battleLogWindow.openness = 0;
    this.addWindow(this._battleLogWindow);
};
Scene_Battle.prototype.createActorCommandWindow = function() {
    this._actorCommandWindow = new Window_ActorCommand(rect);
    this._actorCommandWindow.visible = false;
    this._actorCommandWindow.openness = 0;
    this.addWindow(this._actorCommandWindow);
};
Scene_Battle.prototype.createPartyCommandWindow = function() {
    this._partyCommandWindow = new Window_PartyCommand(rect);
    this._partyCommandWindow.visible = false;
    this._partyCommandWindow.openness = 0;
    this.addWindow(this._partyCommandWindow);
};
ImageManager.loadFace = function() {
    // Return an empty bitmap so nothing loads
    return new Bitmap(144, 144);
};

// --- GLOBAL TARGET ACCESSOR -----------------------------------------------
// Instead of $gameTemp, we read from your React-driven global manager.

function getSelectedTarget() {
    const t = window.clientGlobalManager?.clientEncounterManager?.target;
    return t || null; // { index, side } or null
}


// --- SPRITE ENEMY ----------------------------------------------------------

const _Sprite_Enemy_update = Sprite_Enemy.prototype.update;
Sprite_Enemy.prototype.update = function () {
    _Sprite_Enemy_update.call(this);

    const target = getSelectedTarget();

    if (target && target.side === "enemy" && this._enemy && this._enemy.index() === target.index) {
        this.showSelectionArrow();
    } else {
        this.hideSelectionArrow();
    }
};

Sprite_Enemy.prototype.showSelectionArrow = function () {
    if (!this._arrowSprite) {
        this._arrowSprite = new Sprite(ImageManager.loadSystem("Arrow"));
        this._arrowSprite.anchor.set(0.5, 1);
        this.addChild(this._arrowSprite);
    }

    this._arrowSprite.x = 0;
    this._arrowSprite.y = -75 + Math.sin(Graphics.frameCount / 10) * 4;
    this._arrowSprite.visible = true;
};

Sprite_Enemy.prototype.hideSelectionArrow = function () {
    if (this._arrowSprite) {
        this._arrowSprite.visible = false;
    }
};


// --- SPRITE ACTOR ----------------------------------------------------------

const _Sprite_Actor_update = Sprite_Actor.prototype.update;
Sprite_Actor.prototype.update = function () {
    _Sprite_Actor_update.call(this);

    const target = getSelectedTarget();

    if (target && target.side === "ally" && this._actor && this._actor.index() === target.index) {
        this.showSelectionArrow();
    } else {
        this.hideSelectionArrow();
    }
};

Sprite_Actor.prototype.showSelectionArrow = Sprite_Enemy.prototype.showSelectionArrow;
Sprite_Actor.prototype.hideSelectionArrow = Sprite_Enemy.prototype.hideSelectionArrow;

// Disable victory messages and rewards
BattleManager.displayVictoryMessage = function() {};
BattleManager.displayRewards = function() {};
BattleManager.gainRewards = function() {};

const _BattleManager_endBattle = BattleManager.endBattle;
BattleManager.endBattle = function(result) {
    // Temporarily disable SceneManager.pop()
    SceneManager.pop = function() {
        // do nothing — prevent default map return
    };
    _BattleManager_endBattle.call(this, result);
};