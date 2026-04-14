class Goblin
{
    constructor()
    {
        this.name = "Goblin";
        this.maxHp = 30;
        this.currentHp = 30;
        this.experienceReward = 20;
    }

    randInt(min, max) 
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    processTurn(allyList, index)
    {
        const targetIndex = this.randInt(0, allyList.length - 1);
        const targetAlly = allyList[targetIndex];
        const damage = this.attack(targetAlly);
        return { 
            actionType: 'attack',
            enemyIndex: index,
            targetIndex, 
            damage, 
            encounterMessage: `${this.name} ${index + 1} attacked ${targetAlly.name} for ${damage} damage!` 
        };
    }

    rollGoldDrops()
    {
        return this.randInt(5, 15);
    }

    rollItemDrops()
    {
        return this.randInt(1, 3);
    }

    attack(target)
    {
        const damage = 5; // Fixed damage for simplicity
        target.currentHp = Math.max(target.currentHp - damage, 0);
        return damage;
    }
}

module.exports = Goblin;