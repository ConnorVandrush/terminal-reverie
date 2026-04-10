class CharacterData
{
    constructor() 
    {
        this.playerId = null;
        this.isDead = false;
        this.location = { x: 0, y: 0, d: 0, map: '' };
        this.name = '';
        this.freeSteps = 0;
        this.level = 1;
        this.experience = 0;
        this.gold = 0;
        this.maxHp = 100;
        this.currentHp = this.maxHp;
        this.inventory = {};
        this.appearance = 
        {
            template: null,
            colors: 
            {
                hair: null,
                eyes: null,
                skin: null,
                shirt: null,
                pants: null
            }
        };
        this.availableActions = ["attack", "defend", "item", "run"];
    }

    attack(target)
    {
        const damage = 10; // Fixed damage for simplicity
        target.currentHp = Math.max(target.currentHp - damage, 0);
        return damage;
    }
}

module.exports = CharacterData;