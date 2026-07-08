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
