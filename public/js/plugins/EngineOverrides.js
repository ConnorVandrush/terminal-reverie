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
//SceneManager._scene._spriteset._characterSprites

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
  // const partyManager = window.clientGlobalManager.clientPartyManager;
  const direction = reactDirection ?? Input.dir4;

  if (
    direction <= 0 ||
    !playerManager.characterCanMove ||
    $gamePlayer.isMoving()
  ) {
    return;
  }

  // Party movement
  // if (partyManager.isPartyLeader && !mapManager.isMoving) {
  //   mapManager.isMoving = true;
  //   partyManager.requestPartyMove(direction);
  //   setTimeout(() => mapManager.waitForMovementEnd($gamePlayer), 50); // FIXME isMoving is being set to false too early, this is a band-aid to prevent desync but the root cause should be fixed. Maybe add prediction for party movement as well?
  // }

  // Solo movement with client prediction
  const oldLoc = { x: this.x, y: this.y, d: direction };
  this.moveStraight(direction);
  playerManager.clientRequestMove(direction, oldLoc);
};

// Override Game_Interpreter command 201 (Transfer Player) to use MMO transfer
const _command201 = Game_Interpreter.prototype.command201;
Game_Interpreter.prototype.command201 = function () {
  window.clientAPI.playerManager.clientRequestMapTransfer();
  return true;
};

// Save original SceneManager.pop function, it's disabled during battles
window._pop = SceneManager.pop;

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
