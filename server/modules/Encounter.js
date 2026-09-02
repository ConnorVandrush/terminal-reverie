import CharacterData from "./CharacterData.js";

export default class Encounter {
  constructor(characters, enemies) {
    this.characters = this.characters = characters.map((c) =>
      this.hydrateCharacter(c),
    );
    this.enemies = enemies;
    this.combatantActions = new Map(); // combatantId -> { targetId, action }
    this.turnOrder = [];
    this.maniDrop = null;
    this.expDrop = null;
    this.itemDrop = [];
  }

  hydrateCharacter(raw) {
    const c = new CharacterData();
    Object.assign(c, raw);
    return c;
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

  checkForWinner() {
    const allCharactersDead = this.characters.every((c) => c.isDead);
    const allEnemiesDead = this.enemies.every((e) => e.isDead);

    if (allCharactersDead && allEnemiesDead) {
      return true;
    } else if (allCharactersDead) {
      return true;
    } else if (allEnemiesDead) {
      this.calculateEncounterDrops();
      return true;
    } else {
      return false;
    }
  }

  calculateEncounterDrops() {
    let totalMani = 0;
    let totalExp = 0;
    let allItems = [];

    this.enemies.forEach((enemy) => {
      totalMani += enemy.maniDrop ?? 0;
      totalExp += enemy.expDrop ?? 0;

      if (Array.isArray(enemy.itemDrop)) {
        allItems.push(...enemy.itemDrop);
      }
    });

    this.maniDrop = totalMani;
    this.expDrop = totalExp;
    this.itemDrop = allItems;
  }

  processRound() {
    this.roundResults = [];
    this.getEnemyActions();
    this.turnOrder.forEach((combatantId) => {
      this.processAction(combatantId);
      this.updateCombatantsStatus();
    });
    if (this.checkForWinner()) {
      return {
        roundResults: this.roundResults,
        encounterDrops: true,
      };
    }
    this.determineTurnOrder();
    this.combatantActions = new Map();
    return {
      roundResults: this.roundResults,
      encounterDrops: false,
    };
  }
}
