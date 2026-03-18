class CharacterData
{
    constructor() 
    {
        this.isDead = false;
        this.location = { x: 0, y: 0, map: '' };
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
        this.isPartyLeader = false;
        this.isPartyFollower = false;
        this.partyLeaderId = null;
    }
}

module.exports = CharacterData;