import Enemy from "./Enemy.js";

export default class Goblin extends Enemy {
  constructor() {
    super();
    this.name = "Goblin";
    this.maxHp = 20;
    this.currentHp = 20;
    this.experienceReward = 20;
    this.baseDamage = 10;
  }

  pickEncounterAction(enemies, characters) {
    const aliveCharacters = characters.filter((c) => !c.isDead);
    const target = this.randomElement(aliveCharacters);
    return { targetId: target.characterId, action: "Strike" };
  }
}
