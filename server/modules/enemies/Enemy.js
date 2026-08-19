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
        combatantId: this.enemyInstanceId ?? this.characterId,
        targetId: target.enemyInstanceId ?? target.characterId,
        action: "Strike",
        message: `${this.name} missed ${target.name}.`,
      };
    }
    const damage = this.baseDamage;
    target.currentHp -= damage;
    return {
      combatantId: this.enemyInstanceId ?? this.characterId,
      targetId: target.enemyInstanceId ?? target.characterId,
      action: "Strike",
      damage: damage,
      message: `${target.name} took ${damage} damage.`,
    };
  }
}
