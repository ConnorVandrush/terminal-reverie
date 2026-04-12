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

    hideSelectionArrow()
    {
        this.target = null;
        window.clientGlobalManager.dispatchToReact({ type: 'encounter/setCurrentTarget', payload: null });
    }

    startListeners()
    {
        this.socket = this.playerManager.socket;
        this.socket.on('serverAllyTurnResults', (allyTurnResults) =>
        {
            allyTurnResults.forEach(result => 
            {
                window.clientGlobalManager.dispatchToReact({ type: 'encounter/setEncounterMessage', payload: result.encounterMessage });
                window.clientGlobalManager.dispatchToReact({ type: 'encounter/setEncounterInfo', payload: 'encounterMessage' });
            });
        });
    }
}

window.clientGlobalManager.clientEncounterManager = new ClientEncounterManager();