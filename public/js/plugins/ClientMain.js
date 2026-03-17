window.clientGlobalManager.publicNamespace = io('/login');
window.clientGlobalManager.clientInputManager.enableDomMode();
window.clientGlobalManager.spriteColorer.loadAppearanceData(); // Preload appearance data on client start

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