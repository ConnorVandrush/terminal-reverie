/*:
 * @target MZ
 * @plugindesc Allows Backspace to work in React inputs by bypassing RPG Maker's Input handler.
 * @help
 * This plugin patches Input._onKeyDown so that when focus is inside
 * a text field, textarea, or contentEditable element, RPG Maker ignores
 * the key event. That lets React handle Backspace normally.
 */

(() => {
  class ClientInputManager {
    constructor() {
      this.domMode = false;
      this._originalOnKeyDown = Input._onKeyDown;

      // Disable the hamburger button in the map scene
      Scene_Map.prototype.createButtons = function() {
          // Do nothing — prevents the hamburger button from being created
      };

      // Disable all touch input
      TouchInput.update = function() {};
      TouchInput._onTouchStart = function() {};
      TouchInput._onTouchMove = function() {};
      TouchInput._onTouchEnd = function() {};
      TouchInput._onTouchCancel = function() {};
      TouchInput._onPointerDown = function() {};
      TouchInput._onPointerUp = function() {};
    }

    enableDomMode() {
      this.domMode = true;

      Input._onKeyDown = (event) => {
        const active = document.activeElement;
        const isEditable =
          active &&
          (
            active.tagName === "INPUT" ||
            active.tagName === "TEXTAREA" ||
            active.isContentEditable
          );

        if (this.domMode && isEditable) {
          // Let browser/React handle typing & Backspace
          return;
        }

        this._originalOnKeyDown.call(Input, event);
      };
    }

    enableGameMode() {
      this.domMode = false;
      Input._onKeyDown = this._originalOnKeyDown;
    }
  }

  // Global instance
  window.ClientGlobalManager.clientInputManager = new ClientInputManager();
})();
