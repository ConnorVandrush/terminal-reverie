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

// Override DataManager.loadMapData to prevent loading maps from disk because we inject the MMO map directly into $dataMap.
DataManager.loadMapData = function (mapId) {
  if ($dataMap && $dataMap.id === mapId) {
    // MMO map already injected — do NOT load from disk
    return;
  }

  _DataManager_loadMapData.call(this, mapId);
};
