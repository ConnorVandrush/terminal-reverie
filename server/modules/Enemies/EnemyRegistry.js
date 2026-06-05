import Goblin from "./Goblin.js";

export const EnemyRegistry = {
  Goblin: Goblin,
};

export function createEnemy(enemyName) {
  const EnemyClass = EnemyRegistry[enemyName];
  if (EnemyClass) {
    return new EnemyClass();
  } else {
    return null;
  }
}
