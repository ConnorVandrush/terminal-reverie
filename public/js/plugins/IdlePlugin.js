/*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Version 1.0]
 * @author Gamer Tool Studio
 * @help This plugin allows the game to continue running even when the window loses
 * focus or is minimized.
 */

(() => {
    let gameStarted = false;
    let lastTime = performance.now();
    const frameDuration = 10000 / 60; // 16.67 milliseconds per frame

    // Override document.hasFocus to always return true
    document.hasFocus = function() {
        return true;
    };

    // Override document.hidden to always return false
    Object.defineProperty(document, "hidden", {
        get: function() {
            return false;
        }
    });

    // Hook into Scene_Map to detect when the game has started
    const originalSceneMapStart = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        originalSceneMapStart.call(this);
        if (!gameStarted) {
            gameStarted = true;
            startGameUpdateLoop();
        }
    };

    function startGameUpdateLoop() {
        function gameUpdate() {
            if (SceneManager && SceneManager._scene) {
                const now = performance.now();
                const deltaTime = now - lastTime;

                if (deltaTime >= frameDuration) {
                    lastTime += frameDuration;
                    SceneManager.updateMain();
                } else {
                    lastTime = now;
                }
            }
            requestAnimationFrame(gameUpdate); // Use requestAnimationFrame for accurate timing
        }
        requestAnimationFrame(gameUpdate);
    }

    // Ensure the game loop continues to run without affecting the timing
    const originalSceneManagerUpdateMain = SceneManager.updateMain;
    SceneManager.updateMain = function() {
        if (gameStarted) {
            this._stopped = false;
        }
        originalSceneManagerUpdateMain.call(this);
    };
})();