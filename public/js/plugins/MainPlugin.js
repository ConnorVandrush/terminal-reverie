// Move the RPG Maker canvas into a stable wrapper element
const _Graphics_createCanvas = Graphics._createCanvas;
Graphics._createCanvas = function() {
    // Let RPG Maker do all its normal setup
    _Graphics_createCanvas.call(this);

    // Then move the canvas into a stable wrapper
    const wrapper = document.getElementById("gameWrapper");
    if (wrapper && this._canvas && this._canvas.parentNode !== wrapper) {
        wrapper.appendChild(this._canvas);
    }
};