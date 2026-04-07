class ClientEncounterManager 
{
    constructor()
    {
        this.clientPartyManager = window.clientGlobalManager.clientPartyManager;
    }

    startEncounter({ troopData, enemyData, battleback })
    {
        console.log("Starting encounter with data:", { troopData, enemyData, battleback }, "Current party data:", this.clientPartyManager.partyData);
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
        console.log("Encounter started");
    }

    startListeners()
    {
    }
}

window.clientGlobalManager.clientEncounterManager = new ClientEncounterManager();