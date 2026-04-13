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

    static checkIfActionAvailable(characterData, action)
    {
        return characterData.availableActions.includes(action);
    }

    static processTurn(characterData, allyAction, enemyList)
    {
        if (this.checkIfActionAvailable(characterData, allyAction.actionType))
        {
            switch (allyAction.actionType)
            {
                case 'attack':
                    return this.attack(characterData, enemyList[allyAction.target.index], allyAction.target.index);
                default:
                    console.warn(`Unknown action type: ${allyAction.actionType}`);
                    return false;
            }
        }
        else
        {
            console.warn(`Action ${allyAction.actionType} is not available for character ${characterData.name}`);
            return false;
        }
    }

    static attack(characterData, target, targetIndex)
    {
        const damage = 10; // Fixed damage for simplicity
        target.currentHp = Math.max(target.currentHp - damage, 0);
        const turnResults =
        {
            actionType: 'attack',
            playerId: characterData.playerId,
            targetIndex: targetIndex,
            damage: damage,
            encounterMessage: `${characterData.name} attacked ${target.name} ${targetIndex + 1} for ${damage} damage!`
        };
        return turnResults;
    }
}

module.exports = CharacterData;