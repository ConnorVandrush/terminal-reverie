/*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] Continue running when unfocused without speeding up (safe timing).
 * @author Connor
 */

(() => {
    "use strict";

    // ------------------------------------------------------------
    // 1. Override document.hidden and document.visibilityState
    //    so the engine never thinks the tab is inactive.
    // ------------------------------------------------------------

    Object.defineProperty(document, "hidden", {
        get: () => false
    });

    Object.defineProperty(document, "visibilityState", {
        get: () => "visible"
    });

    // ------------------------------------------------------------
    // 2. Override document.hasFocus so the engine thinks we're active
    // ------------------------------------------------------------

    document.hasFocus = () => true;

    // ------------------------------------------------------------
    // 3. Override Graphics._isFullScreen to prevent throttling
    // ------------------------------------------------------------

    Graphics._isFullScreen = function() {
        return document.fullscreenElement != null;
    };

    // ------------------------------------------------------------
    // 4. DO NOT override SceneManager.updateMain
    //    DO NOT create a second game loop
    //    DO NOT touch requestAnimationFrame
    //
    //    The engine's built-in loop stays intact.
    // ------------------------------------------------------------

})();
