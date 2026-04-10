class Goblin
{
    constructor()
    {
        this.name = "Goblin";
        this.maxHp = 30;
        this.currenthp = 30;
    }

    attack(target)
    {
        const damage = 5; // Fixed damage for simplicity
        target.currentHp = Math.max(target.currentHp - damage, 0);
        return damage;
    }
}

module.exports = Goblin;