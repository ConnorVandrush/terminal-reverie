/*:
 * @target MZ
 * @plugindesc Retro NES-style window skin (message, shop, menu, etc.)
 * @author You
 */

(() => {

    //--------------------------------------------------------------------------
    // Window_Base – core styling
    //--------------------------------------------------------------------------

    const _Window_Base_initialize = Window_Base.prototype.initialize;
    Window_Base.prototype.initialize = function(rect) {
        _Window_Base_initialize.call(this, rect);

        this.opacity = 255;
        this.backOpacity = 255;
        this.padding = 12;

        this.resetFontSettings();

        // Force redraw
        this._refreshBack();
        if (this._backSprite) {
            this._backSprite.visible = true;
        }
    };

    // Prevent MZ from switching window backgrounds
    Window_Base.prototype.updateBackground = function() {
        if (this._backSprite) {
            this._backSprite.visible = true;
        }
    };

    // Disable default window frame
    Window_Base.prototype._refreshFrame = function() {};

    // Custom retro background
    Window_Base.prototype._refreshBack = function() {
        if (!this._backSprite) return;

        const w = this.width;
        const h = this.height;

        this._backSprite.bitmap = new Bitmap(w, h);
        const c = this._backSprite.bitmap;

        // Retro blue fill
        c.fillRect(0, 0, w, h, "#0000aa");

        // White outer border
        c.fillRect(0, 0, w, 4, "#ffffff");
        c.fillRect(0, h - 4, w, 4, "#ffffff");
        c.fillRect(0, 0, 4, h, "#ffffff");
        c.fillRect(w - 4, 0, 4, h, "#ffffff");

        // Inset shadow border
        c.fillRect(4, 4, w - 8, 4, "#0a0a6a");
        c.fillRect(4, h - 8, w - 8, 4, "#0a0a6a");
    };

    // Font setup (messages, shop text, menus)
    Window_Base.prototype.resetFontSettings = function() {
        this.contents.fontFace = $gameSystem.mainFontFace();
        this.contents.fontSize = 18;
        this.contents.textColor = "#ffffff";
        this.contents.outlineWidth = 0;
    };

    //--------------------------------------------------------------------------
    // Window_Message – force redraw on resize (important)
    //--------------------------------------------------------------------------

    const _Window_Message_updatePlacement =
        Window_Message.prototype.updatePlacement;

    Window_Message.prototype.updatePlacement = function() {
        _Window_Message_updatePlacement.call(this);
        this._refreshBack();
    };

})();