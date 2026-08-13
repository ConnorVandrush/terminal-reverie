export default class Encounter {
  constructor(characters, enemies) {
    this.characters = characters;
    this.enemies = enemies;
    this.combatantActions = new Map();
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
      ...this.enemies.map((e) => e.enemyId),
    ];

    this.turnOrder = this.shuffle(ids);
  }

  getCombatant(id) {
    const character = this.characters.find(
      (character) => character.characterId === id,
    );
    if (character) {
      return character;
    }
    const enemy = this.enemies.find((enemy) => enemy.enemyId === id);
    if (enemy) {
      return enemy;
    }
    return null;
  }

  getEnemyActions() {
    this.enemies.forEach((enemy) =>
      this.combatantActions.set(enemy.enemyId, enemy.pickEncounterAction()),
    );
  }

  processAction() {}

  processRound() {
    this.getEnemyActions();
    this.turnOrder.forEach((combatant) => {
      this.processAction();
    });
  }
}
