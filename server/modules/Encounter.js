export default class Encounter {
  constructor(characters, enemies) {
    this.characters = characters;
    this.enemies = enemies;
    this.combatantActions = new Map(); // combatantId -> { targetId, action }
    this.turnOrder = [];
    this.roundResults = [];
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  determineTurnOrder() {
    const ids = [
      ...this.characters.map((c) => c.characterId),
      ...this.enemies.map((e) => e.enemyInstanceId),
    ];

    this.turnOrder = this.shuffle([...ids]);
  }

  getCombatant(id) {
    const character = this.characters.find(
      (character) => character.characterId === id,
    );
    if (character) {
      return character;
    }
    const enemy = this.enemies.find((enemy) => enemy.enemyInstanceId === id);
    if (enemy) {
      return enemy;
    }
    return null;
  }

  getEnemyActions() {
    this.enemies.forEach((enemy) => {
      if (enemy.canAct) {
        this.combatantActions.set(
          enemy.enemyInstanceId,
          enemy.pickEncounterAction(this.enemies, this.characters),
        );
      }
    });
  }

  processAction(combatantId) {
    const combatant = this.getCombatant(combatantId);
    if (combatant.canAct) {
      const action = this.combatantActions.get(combatantId);
      const target = this.getCombatant(action.targetId);
      this.roundResults.push(combatant[action.action](target));
    }
  }

  updateCombatantsStatus() {
    const combatants = [...this.characters, ...this.enemies];
    combatants.forEach((combatant) => {
      if (combatant.currentHp <= 0) {
        combatant.isDead = true;
        combatant.canAct = false;
        combatant.currentHp = 0;
      }
    });
  }

  processRound() {
    this.roundResults = [];
    this.getEnemyActions();
    this.turnOrder.forEach((combatantId) => {
      this.processAction(combatantId);
      this.updateCombatantsStatus();
    });
    this.determineTurnOrder();
    return this.roundResults;
  }
}
