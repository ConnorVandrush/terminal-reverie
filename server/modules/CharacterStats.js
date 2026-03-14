class CharacterStats
{
    constructor() 
    {
        this.freeSteps = 0;
        this.level = 1;
        this.experience = 0;
        this.gold = 0;
        this.maxHp = 100;
        this.currentHp = this.maxHp;
        this.isDead = false;
        this.inventory = [];
        this.appearance = {
            clothingStyle: 1,
            hairStyle: 1,
            hairColor: 1,
            skinColor: 1,
            eyeColor: 1,
            shirtColor: 1,
            pantsColor: 1
        };
    }
}

module.exports = CharacterStats;