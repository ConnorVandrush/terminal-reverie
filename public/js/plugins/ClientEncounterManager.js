class ClientEncounterManager {
  serverStartEncounter(troopData, enemyData) {
    // Inject enemies
    for (const enemy of enemyData) {
      $dataEnemies[enemy.enemy.id] = enemy.enemy;
    }

    // Create a temporary troop
    const serverTroop = {
      id: 0,
      name: troopData.name,
      members: enemyData.map((data) => ({
        enemyId: data.enemy.id,
        x: data.member.x,
        y: data.member.y,
        hidden: data.member.hidden,
      })),
      pages: troopData.pages,
    };

    // Store it in an unused troop slot
    $dataTroops[0] = serverTroop;

    // Start normal RMMZ battle
    BattleManager.setup(0, false, false);

    SceneManager.push(Scene_Battle);
  }
}

window.clientAPI.encounterManager = new ClientEncounterManager();
