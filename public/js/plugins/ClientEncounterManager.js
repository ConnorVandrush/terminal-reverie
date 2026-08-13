class ClientEncounterManager {
  serverStartEncounter(
    troopData,
    rmmzEnemyData,
    reactEnemyData,
    firstTurnOrder,
  ) {
    window.clientAPI.uiState = "encounter";
    for (const enemy of rmmzEnemyData) {
      $dataEnemies[enemy.enemy.id] = enemy.enemy;
    }
    const serverTroop = {
      id: 0,
      name: troopData.name,
      members: rmmzEnemyData.map((data) => ({
        enemyId: data.enemy.id,
        x: data.member.x,
        y: data.member.y,
        hidden: data.member.hidden,
      })),
      pages: troopData.pages,
    };
    $dataTroops[0] = serverTroop;
    $gameMap._battleback1Name = troopData.battleback1 || "";
    $gameMap._battleback2Name = troopData.battleback2 || "";
    BattleManager.setup(0, false, false);
    SceneManager.push(Scene_Battle);
    reactEnemyData.forEach((enemyData, enemyIndex) => {
      window.clientAPI.dispatchToReact({
        type: "EncounterSlice/setEnemyData",
        payload: { enemyIndex, enemyData },
      });
    });
    window.clientAPI.dispatchToReact({
      type: "EncounterSlice/setTurnOrder",
      payload: firstTurnOrder,
    });
    window.clientAPI.dispatchToReact({
      type: "BottomPanelSlice/setBottomPanel",
      payload: "EncounterActionComponent",
    });
    window.clientAPI.dispatchToReact({
      type: "CenterPanelSlice/setCenterPanel",
      payload: "EncounterWindowComponent",
    });
    window.clientAPI.dispatchToReact({
      type: "RightPanelSlice/setRightPanel",
      payload: "EncounterTurnOrderComponent",
    });
  }
}

window.clientAPI.encounterManager = new ClientEncounterManager();
