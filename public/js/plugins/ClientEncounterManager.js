class ClientEncounterManager 
{
    constructor()
    {
        this.playerManager = window.clientGlobalManager.clientPlayerManager;
        this.socket = null;
        this.clientPartyManager = window.clientGlobalManager.clientPartyManager;
        this.target = null; // { index: number, side: 'ally' | 'enemy' }
    }

    startEncounter({ troopData, enemyData, battleback })
    {
        $gameParty._actors.slice().forEach(actorId => 
        {
            $gameParty.removeActor(actorId);
        });
        this.clientPartyManager.partyData.members.forEach((member, index) =>
        {
            $gameActors.actor(index + 1).setBattlerImage("GrasslanderBattle");
            $gameActors.actor(index + 1).setHp(member.currentHp);
            $gameParty.addActor(index + 1);
        });
        $dataTroops[troopData.id] = structuredClone(troopData);
        BattleManager.setup(troopData.id, false, false);
        const troop = $gameTroop.members();
        troop.forEach((enemy, index) =>
        {
            const enemyInfo = enemyData[index];
            if (enemyInfo) 
            {
                enemy._hp = enemyInfo.params[0];
            }
        });
        $gameMap._battleback1Name = battleback;
        SceneManager.push(Scene_Battle);
        window.clientGlobalManager.dispatchToReact({ type: 'centerPanel/setCenterPanel', payload: 'encounterInfo' });
        window.clientGlobalManager.dispatchToReact({ type: 'encounter/setCurrentTarget', payload: null });
        window.clientGlobalManager.dispatchToReact({ type: 'encounter/setEnemyInfo', payload: enemyData.map(enemy => ({ name: enemy.name, maxHp: enemy.maxHp, currentHp: enemy.currentHp })) });
        window.clientGlobalManager.dispatchToReact({ type: 'leftPanel/setLeftPanel', payload: 'enemyInfo' });
        window.clientGlobalManager.dispatchToReact({ type: 'encounter/setAllyInfo', payload: this.clientPartyManager.partyData.members.map(member => ({ name: member.name, maxHp: member.maxHp, currentHp: member.currentHp })) });
        window.clientGlobalManager.dispatchToReact({ type: 'rightPanel/setRightPanel', payload: 'allyInfo' });
    }

    wait(ms)
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    hideSelectionArrow()
    {
        this.target = null;
        window.clientGlobalManager.dispatchToReact({ type: 'encounter/setCurrentTarget', payload: null });
    }

    async processAllyAttackResult(playerId, targetIndex, damage, encounterMessage)
    {
        window.clientGlobalManager.dispatchToReact({ type: 'encounter/setEncounterMessage', payload: encounterMessage });
        const ally = $gameParty.members().find(member => member.actorId() === playerId);
        const enemy = $gameTroop.members()[targetIndex];
        await this.wait(300);
        ally.performAttack();
        await this.wait(300);
        enemy.gainHp(-damage);
        enemy.startDamagePopup();
        enemy.performDamage();
        await this.wait(2000);
        window.clientGlobalManager.dispatchToReact({ type: 'encounter/setEncounterMessage', payload: null });
    }

    async processEnemyAttackResult(enemyIndex, targetIndex, damage, encounterMessage)
    {
        console.log(`enemyIndex: ${enemyIndex}, targetIndex: ${targetIndex}, damage: ${damage}, encounterMessage: ${encounterMessage}`);
        window.clientGlobalManager.dispatchToReact({ type: 'encounter/setEncounterMessage', payload: encounterMessage });
        const enemy = $gameTroop.members()[enemyIndex];
        const enemySprite = BattleManager._spriteset._enemySprites.find(sprite => sprite._enemy === enemy);
        const ally = $gameParty.members()[targetIndex];
        enemySprite.startEffect('whiten');
        await this.wait(300);
        ally.gainHp(-damage);
        ally.startDamagePopup();
        ally.performDamage();
        await this.wait(2000);
        window.clientGlobalManager.dispatchToReact({ type: 'encounter/setEncounterMessage', payload: null });
    }

    startListeners()
    {
        this.socket = this.playerManager.socket;
        this.socket.on('serverTurnResults', async (allyTurnResults, enemyTurnResults) =>
        {
            window.clientGlobalManager.dispatchToReact({ type: 'encounter/setEncounterInfo', payload: 'encounterMessage' });
            await this.wait(500);
            for (const result of allyTurnResults)
            {
                const { actionType, playerId, targetIndex, damage, encounterMessage } = result;
                switch (actionType)
                {
                    case 'attack':
                        await this.processAllyAttackResult(playerId, targetIndex, damage, encounterMessage);
                        break;
                }
            }
            for (const result of enemyTurnResults)
            {
                const { actionType, enemyIndex, targetIndex, damage, encounterMessage } = result;
                switch (actionType)
                {
                    case 'attack':
                        await this.processEnemyAttackResult(enemyIndex, targetIndex, damage, encounterMessage);
                        break;
                }
            }
            window.clientGlobalManager.dispatchToReact({ type: 'encounter/setEncounterInfo', payload: 'commandSelection' });
        });
    }
}

window.clientGlobalManager.clientEncounterManager = new ClientEncounterManager();