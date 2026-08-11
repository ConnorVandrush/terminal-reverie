import Enemy from "./Enemy.js";

export default class Goblin extends Enemy {
  constructor() {
    super();
    this.name = "Goblin";
    this.maxHp = 30;
    this.currentHp = 30;
    this.experienceReward = 20;
  }
}
