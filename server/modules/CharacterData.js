class CharacterData {
  constructor() {
    this.playerId = null;
    this.isDead = false;
    this.isDefending = false;
    this.location = { x: 0, y: 0, d: 0, map: "" };
    this.name = "";
    this.freeSteps = 0;
    this.level = 1;
    this.experience = 0;
    this.gold = 0;
    this.maxHp = 100;
    this.currentHp = this.maxHp;
    this.inventory = {}; //{ '1': { id: 1, name: 'Herb', description: 'Restores 25% of max HP', effects: { restoreHP: 25 }, quantity: 10 } }
    this.equipment = {
      weapon: null,
      armor: null,
      accessory: null,
      item1: null,
      item2: null,
      item3: null,
    };
    this.appearance = {
      template: null,
      colors: {
        hair: null,
        eyes: null,
        skin: null,
        shirt: null,
        pants: null,
      },
    };
    this.availableActions = ["attack", "defend", "item", "run"];
    this.tradeOffer = null;
  }

  static randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static checkIfActionAvailable(characterData, action) {
    return characterData.availableActions.includes(action);
  }

  static processTurn(characterData, allyAction, enemyList) {
    if (this.checkIfActionAvailable(characterData, allyAction.actionType)) {
      switch (allyAction.actionType) {
        case "attack":
          return this.attack(
            characterData,
            enemyList[allyAction.target.index],
            allyAction.target.index,
          );
        case "defend":
          return this.defend(characterData);
        default:
          return false;
      }
    } else {
      return false;
    }
  }

  static attack(characterData, target, targetIndex) {
    let targetAlreadyDead;
    if (target.currentHp <= 0) {
      targetAlreadyDead = true;
    }
    const damage = this.randInt(20, 30);
    target.currentHp = Math.max(target.currentHp - damage, 0);
    const turnResults = {
      actionType: "attack",
      playerId: characterData.playerId,
      targetIndex: targetIndex,
      damage: damage,
      encounterMessage: `${characterData.name} attacked ${target.name} ${targetIndex + 1} for ${damage} damage!`,
    };
    if (targetAlreadyDead) {
      turnResults.damage = 0;
      turnResults.encounterMessage = `${characterData.name} attacked thin air!`;
    }
    return turnResults;
  }

  static defend(characterData) {
    characterData.isDefending = true;
    const turnResults = {
      actionType: "defend",
      playerId: characterData.playerId,
      encounterMessage: `${characterData.name} defends themselves!`,
    };
    return turnResults;
  }
}

module.exports = CharacterData;
