const CharacterData = require('./CharacterData');
const playerModel = require('./PlayerAccountModel');

class Encounter
{
    constructor(serverEncounterManager, allyList, enemyList, encounterRoom)
    {
        this.serverEncounterManager = serverEncounterManager;
        this.allyList = allyList; // Array of characterData objects
        this.enemyList = enemyList;
        this.room = encounterRoom;
        this.allyTurns = [];
        this.allyTurnResults = [];
        this.enemyTurnResults = [];
        this.deadAllies = [];
        this.deadEnemies = [];
    }

    isAbleToAct(characterData)
    {
        return !characterData.isDead;
    }

    checkForDead()
    {
        for (const ally of this.allyList) 
        {
            const index = this.allyList.indexOf(ally);

            if (ally.currentHp <= 0 && !this.deadAllies.includes(index)) 
            {
                ally.isDead = true;
                this.deadAllies.push(index);
            }
        }
        for (const enemy of this.enemyList)
        {
            const index = this.enemyList.indexOf(enemy);

            if (enemy.currentHp <= 0 && !this.deadEnemies.includes(index))
            {
                enemy.isDead = true;
                this.deadEnemies.push(this.enemyList.indexOf(enemy));
            }
        }
    }

    checkForWinner()
    {
        if (this.deadAllies.length === this.allyList.length)
        {
            this.allyList.forEach(async ally =>
            {
                const userData = await playerModel.findOne({ playerId: ally.playerId });
                userData.isDead = true;
                await userData.save();
                this.serverEncounterManager.endEncounter(ally.playerId);
            });
            this.serverEncounterManager.serverPartyManager.playerParties.delete(this.allyList[0].playerId);
        }
        else if (this.deadEnemies.length === this.enemyList.length)
        {
            const rewards = this.enemyList.reduce((acc, enemy) =>
            {
                acc.gold += enemy.rollGoldDrops();
                acc.experience += enemy.experienceReward;
                return acc;
            }, { gold: 0, experience: 0 });
            rewards.gold = Math.floor(rewards.gold / this.allyList.length);
            rewards.experience = Math.floor(rewards.experience / this.allyList.length);
            this.allyList.forEach(async ally =>
            {
                this.serverEncounterManager.endEncounter(ally.playerId);
                if (ally.currentHp <= 0)
                {
                    ally.currentHp = 1;
                    ally.isDead = false;
                }
            });
            return { rewardMessage: `You are victorious! You gained ${rewards.gold} gold and ${rewards.experience} experience!`, gold: rewards.gold, experience: rewards.experience };
        }
    }

    setupNextTurn()
    {
        this.allyList.forEach(ally =>
        {
            ally.isDefending = false;
        });
    }

    processTurn(allyTurnData)
    {
        this.allyTurns.push(allyTurnData);
        if (this.allyTurns.length === (this.allyList.length - this.deadAllies.length))
        {
            this.setupNextTurn();
            for (const allyAction of this.allyTurns)
            {
                if (!this.isAbleToAct(allyAction.characterData)) continue;
                const allyTurnResult = CharacterData.processTurn(allyAction.characterData, allyAction, this.enemyList);
                this.allyTurnResults.push(allyTurnResult);
                this.checkForDead();
            }

            for (const [i, enemy] of this.enemyList.entries())
            {
                if (!this.isAbleToAct(enemy)) continue;
                const enemyTurnResult = enemy.processTurn(this.allyList, i);
                this.enemyTurnResults.push(enemyTurnResult);
                this.checkForDead();
            }

            const rewards = this.checkForWinner();
            if (rewards)
            {
                this.serverEncounterManager.broadcastTurnResults(this.room, this.allyTurnResults, this.enemyTurnResults, this.deadAllies, this.deadEnemies, rewards);
            }
            else
            {
                this.serverEncounterManager.broadcastTurnResults(this.room, this.allyTurnResults, this.enemyTurnResults, this.deadAllies, this.deadEnemies);
            }
            this.allyTurns = [];
            this.allyTurnResults = [];
            this.enemyTurnResults = [];
        }
    }
}

module.exports = Encounter;