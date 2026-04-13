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
        this.enemyTurnResults = [];
    }

    processTurn(allyTurnData)
    {
        this.allyTurns.push(allyTurnData);
        if (this.allyTurns.length === this.allyList.length)
        {
            for (const allyAction of this.allyTurns)
            {
                const allyTurnResult = CharacterData.processTurn(allyAction.characterData, allyAction, this.enemyList);
                this.allyTurnResults.push(allyTurnResult);
            }

            for (const [i, enemy] of this.enemyList.entries())
            {
                const enemyTurnResult = enemy.processTurn(this.allyList, i);
                this.enemyTurnResults.push(enemyTurnResult);
            }

            this.serverEncounterManager.broadcastTurnResults(this.room, this.allyTurnResults, this.enemyTurnResults);
            this.allyTurns = [];
            this.allyTurnResults = [];
            this.enemyTurnResults = [];
        }
    }
}

module.exports = Encounter;