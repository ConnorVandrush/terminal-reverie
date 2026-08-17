// Prevent loosing focus when not active tab
Object.defineProperty(document, "hidden", {
  get: () => false,
});
Object.defineProperty(document, "visibilityState", {
  get: () => "visible",
});
document.hasFocus = () => true;
Graphics._isFullScreen = function () {
  return document.fullscreenElement != null;
};

// Move the RPG Maker canvas into a stable wrapper element
const _Graphics_createCanvas = Graphics._createCanvas;
Graphics._createCanvas = function () {
  // Let RPG Maker do all its normal setup
  _Graphics_createCanvas.call(this);

  // Then move the canvas into a stable wrapper
  const wrapper = document.getElementById("game");
  if (wrapper && this._canvas && this._canvas.parentNode !== wrapper) {
    wrapper.appendChild(this._canvas);
  }
};

// Prevent gameVideo element from being created and covering buttons
Video.initialize = function () {
  // Completely disable video creation
  this._element = null;
};

// Hide title screen commands to prevent starting a new game or loading a save
const _Scene_Title_createCommandWindow =
  Scene_Title.prototype.createCommandWindow;
Scene_Title.prototype.createCommandWindow = function () {
  _Scene_Title_createCommandWindow.call(this);

  this._commandWindow.hide();
};

// Disable the hamburger button in the map scene
Scene_Map.prototype.createButtons = function () {
  // Do nothing
};

// Disable all touch input
TouchInput.update = function () {};
TouchInput._onTouchStart = function () {};
TouchInput._onTouchMove = function () {};
TouchInput._onTouchEnd = function () {};
TouchInput._onTouchCancel = function () {};
TouchInput._onPointerDown = function () {};
TouchInput._onPointerUp = function () {};

// Always let DOM inputs handle keyboard events
const _Input_onKeyDown = Input._onKeyDown;
Input._onKeyDown = function (event) {
  const active = document.activeElement;
  const isEditable =
    active &&
    (active.tagName === "INPUT" ||
      active.tagName === "TEXTAREA" ||
      active.isContentEditable);

  if (isEditable) {
    // Let the browser/React handle typing, Backspace, etc.
    return;
  }

  _Input_onKeyDown.call(this, event);
};

// Override DataManager.loadMapData to prevent loading maps from disk because we inject the MMO map directly into $dataMap.
DataManager.loadMapData = function (mapId) {
  if ($dataMap && $dataMap.id === mapId) {
    // MMO map already injected — do NOT load from disk
    return;
  }

  _DataManager_loadMapData.call(this, mapId);
};

// Save original SceneManager.pop function, it's disabled during battles
window._pop = SceneManager.pop;
// Hook into Scene_Map to notify server map has finished loading
const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function () {
  _Scene_Map_onMapLoaded.call(this);
  SceneManager.pop = window._pop;

  window.clientAPI.authNamespace.emit("clientMapTransferComplete");
  window.clientAPI.playerManager.characterCanMove = true;
  window.clientAPI.playerManager.processRemoteCharacters = true;
};

// Override Sprite_Character to use the custom bitmap if it exists
// ============================================================================
// 1. Override setCharacterBitmap to use _customBitmap when present
// ============================================================================
const _Sprite_Character_setCharacterBitmap =
  Sprite_Character.prototype.setCharacterBitmap;
Sprite_Character.prototype.setCharacterBitmap = function () {
  const custom = this._character && this._character._customBitmap;

  if (!custom) {
    _Sprite_Character_setCharacterBitmap.call(this);
    return;
  }

  const tryApply = () => {
    if (custom.isReady() && custom.baseTexture && custom.baseTexture.valid) {
      this.applyCustomCharacterBitmap(custom);
    } else {
      requestAnimationFrame(tryApply);
    }
  };

  tryApply();
};

// ============================================================================
// 2. Apply the custom bitmap safely (async‑safe, race‑proof)
// ============================================================================
Sprite_Character.prototype.applyCustomCharacterBitmap = function (bitmap) {
  this.bitmap = bitmap;
  this._isBigCharacter = true;

  // Force engine to rebuild frame from bitmap (SAFE WAY)
  this._refresh();
  this.updateFrame();
};

// ============================================================================
// 3. Guard updateFrame so the engine never crashes on undefined bitmap
// ============================================================================
const _Sprite_Character_updateFrame = Sprite_Character.prototype.updateFrame;
Sprite_Character.prototype.updateFrame = function () {
  if (!this.bitmap || !this.bitmap.isReady()) {
    return; // Skip until bitmap is valid
  }
  _Sprite_Character_updateFrame.call(this);
};
// Override ImageManager.loadCharacter to prevent loading character sprites from disk
const _loadCharacter = ImageManager.loadCharacter;
ImageManager.loadCharacter = function (filename) {
  // Disable loading when filename is empty OR starts with "$"
  if (!filename || filename.startsWith("$")) {
    const placeholder = new Bitmap(48, 48);
    placeholder.fillAll("rgba(0,0,0,0)");
    return placeholder;
  }
  return _loadCharacter.call(this, filename);
};
const _ImageManager_loadBitmapFromUrl = ImageManager.loadBitmapFromUrl;
ImageManager.loadBitmapFromUrl = function (url) {
  // Detect real URLs or data URLs
  const isRealUrl =
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:image");

  if (!isRealUrl) {
    // Fall back to the original behavior
    return _ImageManager_loadBitmapFromUrl.call(this, url);
  }
  // --- Your custom URL loader ---
  const bitmap = new Bitmap();
  const image = new Image();

  image.crossOrigin = "anonymous";

  bitmap._image = image;
  bitmap._loadingState = "loading";

  image.addEventListener("load", bitmap._onLoad.bind(bitmap));
  image.addEventListener("error", bitmap._onError.bind(bitmap));

  image.src = url;

  return bitmap;
};

// Disable all dashing in RMMZ
const _Game_Player_isDashing = Game_Player.prototype.isDashing;
Game_Player.prototype.isDashing = function () {
  return false;
};

// Client-side movement with server reconciliation and client prediction
Game_Player.prototype.moveByInput = async function (reactDirection) {
  const playerManager = window.clientAPI.playerManager;
  const direction = reactDirection ?? Input.dir4;
  const inParty = window.clientAPI.getReactState().PartySlice.partyMembers[1];

  if (
    direction <= 0 ||
    !playerManager.characterCanMove ||
    $gamePlayer.isMoving()
  ) {
    return;
  }

  const oldLoc = { x: this.x, y: this.y, d: direction };
  if (!inParty) {
    this.moveStraight(direction);
  }
  playerManager.clientRequestMove(direction, oldLoc);
};

// Override Game_Interpreter command 201 (Transfer Player) to use MMO transfer
const _command201 = Game_Interpreter.prototype.command201;
Game_Interpreter.prototype.command201 = function () {
  window.clientAPI.playerManager.characterCanMove = false;
  window.clientAPI.playerManager.clientRequestMapTransfer();
  return true;
};

// Look for pending player changes (new players, disconnects) on each update and process them
const _Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function () {
  _Scene_Map_update.call(this);

  if (!window.clientAPI.playerManager.processRemoteCharacters) return;
  window.clientAPI.playerManager.processJoiningAndLeavingCharacters();
};

// Extend Game_Event and Game_Player to handle networked movement
const _Game_Event_update = Game_Event.prototype.update;
Game_Event.prototype.update = function () {
  _Game_Event_update.call(this);
  this.updateNetMovement();
};
const _Game_Player_update = Game_Player.prototype.update;
Game_Player.prototype.update = function (sceneActive) {
  _Game_Player_update.call(this, sceneActive);
  this.updateNetMovement();
};
Game_CharacterBase.prototype.updateNetMovement = function () {
  if (
    !this._netMovementQueue ||
    this._netMovementQueue.length === 0 ||
    this.isMoving()
  )
    return;
  const next = this._netMovementQueue.shift();
  const dir = this.findDirectionTo(next.x, next.y);
  this.moveStraight(dir);
};

// Disable default battle windows
const rect = new Rectangle(0, 0, 0, 0);
Scene_Battle.prototype.createStatusWindow = function () {
  this._statusWindow = new Window_BattleStatus(rect);
  this._statusWindow.visible = false;
  this._statusWindow.openness = 0;
  this.addWindow(this._statusWindow);
};
Game_Troop.prototype.enemyNames = function () {
  return []; // return no names → no message
};
Scene_Battle.prototype.createBattleLogWindow = function () {
  this._battleLogWindow = new Window_BattleLog(rect);
  this._battleLogWindow.visible = false;
  this._battleLogWindow.openness = 0;
  this.addWindow(this._battleLogWindow);
};
Scene_Battle.prototype.createActorCommandWindow = function () {
  this._actorCommandWindow = new Window_ActorCommand(rect);
  this._actorCommandWindow.visible = false;
  this._actorCommandWindow.openness = 0;
  this.addWindow(this._actorCommandWindow);
};
Scene_Battle.prototype.createPartyCommandWindow = function () {
  this._partyCommandWindow = new Window_PartyCommand(rect);
  this._partyCommandWindow.visible = false;
  this._partyCommandWindow.openness = 0;
  this.addWindow(this._partyCommandWindow);
};
ImageManager.loadFace = function () {
  // Return an empty bitmap so nothing loads
  return new Bitmap(144, 144);
};

// Disable victory messages and rewards
BattleManager.displayVictoryMessage = function () {};
BattleManager.displayRewards = function () {};
BattleManager.gainRewards = function () {};

const _BattleManager_endBattle = BattleManager.endBattle;
BattleManager.endBattle = function (result) {
  // Temporarily disable SceneManager.pop()
  SceneManager.pop = function () {
    // do nothing — prevent default map return
  };
  _BattleManager_endBattle.call(this, result);
};

// Set battler positions
const _Sprite_Actor_setActorHome = Sprite_Actor.prototype.setActorHome;

Sprite_Actor.prototype.setActorHome = function (index) {
  _Sprite_Actor_setActorHome.call(this, index);

  const actor = this._actor;
  if (!actor) return;

  const positions = {
    1: { x: 610, y: 205 },
    2: { x: 610, y: 275 },
    3: { x: 610, y: 345 },
    4: { x: 610, y: 415 },
  };

  const pos = positions[actor.actorId()];
  if (pos) {
    this.setHome(pos.x, pos.y);
  }
};

// Remove actor battler shadows
Sprite_Actor.prototype.updateShadow = function () {
  if (this._shadowSprite) {
    this._shadowSprite.visible = false;
  }
};

// Selection arrow
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
Sprite_Actor.prototype.showSelectionArrow =
  Sprite_Enemy.prototype.showSelectionArrow;
Sprite_Actor.prototype.hideSelectionArrow =
  Sprite_Enemy.prototype.hideSelectionArrow;
const _Sprite_Enemy_update = Sprite_Enemy.prototype.update;
Sprite_Enemy.prototype.update = function () {
  _Sprite_Enemy_update.call(this);

  const target = window.clientAPI.getReactState().EncounterSlice.target;

  if (
    target &&
    target.side === "enemy" &&
    this._enemy &&
    this._enemy.index() === target.index
  ) {
    this.showSelectionArrow();
  } else {
    this.hideSelectionArrow();
  }
};
const _Sprite_Actor_update = Sprite_Actor.prototype.update;
Sprite_Actor.prototype.update = function () {
  _Sprite_Actor_update.call(this);

  const target = window.clientAPI.getReactState().EncounterSlice.target;

  if (
    target &&
    target.side === "ally" &&
    this._actor &&
    this._actor.index() === target.index
  ) {
    this.showSelectionArrow();
  } else {
    this.hideSelectionArrow();
  }
};

// Battler Sprite
const _Sprite_Actor_setBattler = Sprite_Actor.prototype.setBattler;
Sprite_Actor.prototype.setBattler = function (battler) {
  _Sprite_Actor_setBattler.call(this, battler);
  this.applyCustomBattlerBitmap();
};
const _Sprite_Actor_updateBitmap = Sprite_Actor.prototype.updateBitmap;
Sprite_Actor.prototype.updateBitmap = function () {
  _Sprite_Actor_updateBitmap.call(this);
  this.applyCustomBattlerBitmap();
};
Sprite_Actor.prototype.applyCustomBattlerBitmap = function () {
  const actor = this._actor;

  if (!actor || !actor._customBattlerBitmap) {
    return;
  }

  if (this._mainSprite.bitmap !== actor._customBattlerBitmap) {
    this._mainSprite.bitmap = actor._customBattlerBitmap;
  }
};
