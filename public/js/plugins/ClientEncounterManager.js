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
        window.clientGlobalManager.dispatchToReact({ type: 'encounter/setEncounterInfo', payload: 'commandSelection' });
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

    updateReactEncounterState()
    {
        const members = this.clientPartyManager.partyData.members;
        window.clientGlobalManager.dispatchToReact({ type: 'encounter/setAllyInfo', payload: members.map(m => (
            {
                name: m.name,
                maxHp: m.maxHp,
                currentHp: m.currentHp,
            }))
        });
    }

    updateReactStatsState()
    {
        const characterData = this.clientPartyManager.partyData.members.find(member => member.playerId === this.playerManager.characterData.playerId);
        window.clientGlobalManager.dispatchToReact({ type: 'stats/setStats', payload: { level: characterData.level, experience: characterData.experience, gold: characterData.gold, currentHp: characterData.currentHp, maxHp: characterData.maxHp } });
    }

    checkIfDead(deadAllies, deadEnemies)
    {
        if (deadAllies.length > 0)
        {
            $gameParty.members().forEach((member, index) =>
            {
                if (deadAllies.includes(index) && member._hp <= 0)
                {
                    const actor = $gameActors.actor(member.actorId());
                    actor.setHp(0);
                }
            });
        }
        if (deadEnemies.length > 0)
        {
            $gameTroop.members().forEach((enemy, index) =>
            {
                if (deadEnemies.includes(index))
                {
                    if (!enemy.isDead())
                    {
                        enemy.addState(enemy.deathStateId());
                        enemy.performCollapse();
                    }
                }
            });
        }
    }

    async processAllyAttackResult(playerId, targetIndex, damage, encounterMessage, deadAllies, deadEnemies)
    {
        window.clientGlobalManager.dispatchToReact({ type: 'encounter/appendEncounterMessage', payload: encounterMessage });
        const ally = $gameParty.members().find(member => member.actorId() === playerId);
        const enemy = $gameTroop.members()[targetIndex];
        await this.wait(300);
        ally.performAttack();
        await this.wait(300);
        enemy.gainHp(-damage);
        enemy.startDamagePopup();
        enemy.performDamage();
        await this.wait(300);
        this.checkIfDead(deadAllies, deadEnemies);
        await this.wait(2000);
    }

    async processEnemyAttackResult(enemyIndex, targetIndex, damage, encounterMessage, deadAllies, deadEnemies)
    {
        const characterData = window.clientGlobalManager.clientPartyManager.partyData.members[targetIndex];
        characterData.currentHp = Math.max(characterData.currentHp - damage, 0);
        window.clientGlobalManager.dispatchToReact({ type: 'encounter/appendEncounterMessage', payload: encounterMessage });
        this.updateReactEncounterState();
        const enemy = $gameTroop.members()[enemyIndex];
        const enemySprite = BattleManager._spriteset._enemySprites.find(sprite => sprite._enemy === enemy);
        const ally = $gameParty.members()[targetIndex];
        enemySprite.startEffect('whiten');
        await this.wait(300);
        ally.gainHp(-damage);
        ally.startDamagePopup();
        ally.performDamage();
        await this.wait(300);
        this.checkIfDead(deadAllies, deadEnemies);
        await this.wait(2000);
    }

    startListeners()
    {
        this.socket = this.playerManager.socket;
        this.socket.on('serverTurnResults', async (allyTurnResults, enemyTurnResults, deadAllies, deadEnemies, rewards) =>
        {
            window.clientGlobalManager.dispatchToReact({ type: 'encounter/setEncounterInfo', payload: 'encounterMessage' });
            await this.wait(500);
            for (const result of allyTurnResults)
            {
                const { actionType, playerId, targetIndex, damage, encounterMessage } = result;
                switch (actionType)
                {
                    case 'attack':
                        await this.processAllyAttackResult(playerId, targetIndex, damage, encounterMessage, deadAllies, deadEnemies);
                        break;
                }
            }
            for (const result of enemyTurnResults)
            {
                const { actionType, enemyIndex, targetIndex, damage, encounterMessage } = result;
                switch (actionType)
                {
                    case 'attack':
                        await this.processEnemyAttackResult(enemyIndex, targetIndex, damage, encounterMessage, deadAllies, deadEnemies);
                        break;
                }
            }
            if (deadAllies.includes(window.clientGlobalManager.clientPartyManager.partyData.members.findIndex(member => member.playerId === window.clientGlobalManager.clientPlayerManager.characterData.playerId)))
            {
                await this.wait(1000);
                SceneManager.goto(Scene_Gameover);
                window.clientGlobalManager.dispatchToReact({ type: 'encounter/setEncounterInfo', payload: 'gameOver' });
                return;
            }
            else if (rewards)
            {
                await this.wait(1000);
                const characterData = window.clientGlobalManager.clientPartyManager.partyData.members.find(member => member.playerId === window.clientGlobalManager.clientPlayerManager.characterData.playerId);
                characterData.gold += rewards.gold;
                characterData.experience += rewards.experience;
                window.clientGlobalManager.dispatchToReact({ type: 'encounter/appendEncounterMessage', payload: rewards.rewardMessage });
                await this.wait(3000);
                const response = await this.socket.emitWithAck('clientRequestTransferFromEncounter');
                if (response.success)                
                {
                    this.updateReactStatsState();
                    window.clientGlobalManager.dispatchToReact({ type: 'encounter/clearEncounterMessages' });
                    window.clientGlobalManager.dispatchToReact({ type: 'centerPanel/setCenterPanel', payload: null });
                    window.clientGlobalManager.dispatchToReact({ type: 'leftPanel/setLeftPanel', payload: 'userInterface' });
                    window.clientGlobalManager.dispatchToReact({ type: 'rightPanel/setRightPanel', payload: 'stats' });
                    window.clientGlobalManager.clientMapManager.transferToMap(response.mapData, response.tileset, response.x, response.y, response.d, response.playersOnMap);
                }
            }
            else
            {
                window.clientGlobalManager.dispatchToReact({ type: 'encounter/setEncounterInfo', payload: 'commandSelection' });
            }
        });
    }
}

window.clientGlobalManager.clientEncounterManager = new ClientEncounterManager();