export default class CharacterData {
  constructor() {
    this.characterId = null;
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
}
