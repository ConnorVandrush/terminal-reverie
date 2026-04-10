class Encounter
{
    constructor(allyList, enemyList, encounterRoom)
    {
        this.allyList = allyList;
        this.enemyList = enemyList;
        this.room = encounterRoom;
        this.allyTurn = [];
    }

    processAllyTurn(allyTurnData)
    {
        console.log("Processing ally turn with data:", allyTurnData);
    }
}

module.exports = Encounter;