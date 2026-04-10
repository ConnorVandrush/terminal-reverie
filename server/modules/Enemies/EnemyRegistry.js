import Goblin from './Goblin.js';

export const EnemyRegistry = 
{
    "Goblin": Goblin
};

export function createEnemy(enemyName)
{
    const EnemyClass = EnemyRegistry[enemyName];
    if (EnemyClass)
    {
        return new EnemyClass();
    }
    else
    {
        console.warn(`Enemy class not found for name: ${enemyName}`);
        return null;
    }
}