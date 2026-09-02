import Enemy from "./Enemy.js";

export default class Goblin extends Enemy {
  constructor() {
    super();
    this.name = "Goblin";
    this.maxHp = 20;
    this.currentHp = 20;
    this.baseDamage = 10;
    this.maniDrop = null;
    this.expDrop = 5;
    this.itemDrop = [];
    this.calculateDrops();
  }

  pickEncounterAction(enemies, characters) {
    const aliveCharacters = characters.filter((c) => !c.isDead);
    const target = this.randomElement(aliveCharacters);
    return { targetId: target.characterId, action: "Strike" };
  }

  calculateDrops() {
    this.maniDrop = this.randomInteger(3, 5);
    if (Math.random() < 0.25) {
      this.itemDrop.push(5);
    }
  }
}
