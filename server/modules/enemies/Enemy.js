export default class Enemy {
  constructor() {
    this.canAct = true;
    this.enemyInstanceId = null;
  }

  randomElement(arr) {
    const idx = Math.floor(Math.random() * arr.length);
    return arr[idx];
  }

  Strike(target) {
    if (target.isDead) {
      return {
        action: "Strike",
        message: `${this.name} missed ${target.name}.`,
      };
    }
    const damage = this.baseDamage;
    target.currentHp -= damage;
    return {
      action: "Strike",
      damage: damage,
      message: `${target.name} took ${damage} damage.`,
    };
  }
}
