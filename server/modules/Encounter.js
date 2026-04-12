const CharacterData = require('./CharacterData');

class Encounter
{
    constructor(serverEncounterManager, allyList, enemyList, encounterRoom)
    {
        this.serverEncounterManager = serverEncounterManager;
        this.allyList = allyList;
        this.enemyList = enemyList;
        this.room = encounterRoom;
        this.allyTurns = [];
        this.allyTurnResults = [];
    }

    processAllyTurn(allyTurnData)
    {
        this.allyTurns.push(allyTurnData);
        if (this.allyTurns.length === this.allyList.length)
        {
            for (const allyAction of this.allyTurns)
            {
                switch (allyAction.actionType)
                {
                    case 'attack':
                        this.processAttack(allyAction);
                        break;
                    default:
                        console.warn(`Unknown action type: ${allyAction.actionType}`);
                }
            }

            this.serverEncounterManager.broadcastTurnResults(this.room, this.allyTurnResults);
            this.allyTurns = [];
            this.allyTurnResults = [];
        }
    }

    processAttack(allyTurn)
    {
        const characterData = allyTurn.characterData;
        const targetEnemy = this.enemyList[allyTurn.target.index];
        const damage = CharacterData.attack(characterData, targetEnemy);
        const turnResults = 
        {
            playerId: characterData.playerId,
            targetIndex: allyTurn.target.index,
            damage: damage,
            encounterMessage: `${characterData.name} attacked ${targetEnemy.name} ${allyTurn.target.index + 1} for ${damage} damage!`
        };
        this.allyTurnResults.push(turnResults);
    }
}

module.exports = Encounter;