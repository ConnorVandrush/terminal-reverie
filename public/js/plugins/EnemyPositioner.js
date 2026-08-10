/*:
 * @target MZ
 * @plugindesc Positions up to 8 enemies in a 2-column x 4-row formation.
 * @author ChatGPT
 *
 * @help
 * ============================================================================
 * Enemy Formation
 * ============================================================================
 *
 * Enemies are automatically positioned like this:
 *
 * Enemy 1   Enemy 5
 * Enemy 2   Enemy 6
 * Enemy 3   Enemy 7
 * Enemy 4   Enemy 8
 *
 * Enemy IDs can still be added through the troop Note box:
 *
 * <Extra Enemies>
 * 5
 * 5
 * 12
 * 18
 * </Extra Enemies>
 *
 * The normal enemies in the troop plus the Extra Enemies are
 * automatically arranged into the formation.
 *
 * Maximum: 8 enemies.
 *
 * ============================================================================
 */

(() => {
  //=========================================================================
  // CONFIGURATION
  //=========================================================================

  // Left-most enemy column
  const ENEMY_START_X = 182;

  // Distance between the two enemy columns
  const X_SPACING = 70;

  // Match the actor Y positions exactly
  const Y_POSITIONS = [205, 275, 345, 415];

  //=========================================================================
  // TROOP SETUP
  //=========================================================================

  const _Game_Troop_setup = Game_Troop.prototype.setup;

  Game_Troop.prototype.setup = function (troopId) {
    _Game_Troop_setup.call(this, troopId);

    const troop = $dataTroops[troopId];

    if (!troop) return;

    const note = troop.note || "";

    const match = note.match(/<Extra Enemies>([\s\S]*?)<\/Extra Enemies>/i);

    if (match) {
      const lines = match[1]
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean);

      for (const line of lines) {
        const enemyId = Number(line);

        if (!enemyId) continue;

        // Don't exceed the normal RPG Maker MZ limit of 8
        if (this._enemies.length >= 8) break;

        this._enemies.push(new Game_Enemy(enemyId, 0, 0));
      }
    }

    arrangeFormation(this._enemies);

    this.makeUniqueNames();
  };

  //=========================================================================
  // ENEMY FORMATION
  //=========================================================================

  function arrangeFormation(enemies) {
    for (let i = 0; i < enemies.length && i < 8; i++) {
      // First 4 enemies go down the first column.
      // Next 4 enemies go down the second column.

      const column = Math.floor(i / 4);
      const row = i % 4;

      const x = ENEMY_START_X + column * X_SPACING;

      const y = Y_POSITIONS[row];

      enemies[i]._screenX = x;
      enemies[i]._screenY = y;
    }
  }
})();
