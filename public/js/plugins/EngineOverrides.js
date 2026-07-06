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

// Disable touch input
TouchInput.update = function () {};

// Hide title screen commands to prevent starting a new game or loading a save
const _Scene_Title_createCommandWindow =
  Scene_Title.prototype.createCommandWindow;
Scene_Title.prototype.createCommandWindow = function () {
  _Scene_Title_createCommandWindow.call(this);

  this._commandWindow.hide();
};

// Disable the hamburger button in the map scene
Scene_Map.prototype.createButtons = function () {
  // Do nothing — prevents the hamburger button from being created
};

// Let React handle text inputs
Input._onKeyDown = function (event) {
  const active = document.activeElement;
  const isEditable =
    active &&
    (active.tagName === "INPUT" ||
      active.tagName === "TEXTAREA" ||
      active.isContentEditable);

  if (isEditable) {
    return; // React handles it
  }

  // Otherwise let RPG Maker handle it
  this._originalOnKeyDown.call(Input, event);
};

// Override DataManager.loadMapData to prevent loading maps from disk because we inject the MMO map directly into $dataMap.
DataManager.loadMapData = function (mapId) {
  if ($dataMap && $dataMap.id === mapId) {
    // MMO map already injected — do NOT load from disk
    return;
  }

  _DataManager_loadMapData.call(this, mapId);
};
