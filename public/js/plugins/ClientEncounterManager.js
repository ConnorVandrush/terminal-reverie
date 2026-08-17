class ClientEncounterManager {
  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async serverStartEncounter(
    troopData,
    rmmzEnemyData,
    reactEnemyData,
    firstTurnOrder,
  ) {
    window.clientAPI.uiState = "encounter";

    $gameParty._actors.slice().forEach((actorId) => {
      $gameParty.removeActor(actorId);
    });

    const partyMembers = window.clientAPI
      .getReactState()
      .PartySlice.partyMembers.filter((c) => c != null);

    await Promise.all(
      partyMembers.map(async (member, index) => {
        const actorId = index + 1;
        const actor = $gameActors.actor(actorId);

        // Generate the 576x384 9x6 battler spritesheet.
        const sprite =
          await window.clientAPI.spriteManager.generateBase64pngSpritesheet(
            member.appearance,
            "Battler",
          );

        if (sprite && actor) {
          // Turn the data URL into an RPG Maker Bitmap.
          const bitmap = ImageManager.loadBitmapFromUrl(sprite);

          // Store it on the actor.
          actor._customBattlerBitmap = bitmap;
        }

        actor.setHp(member.currentHp);

        $gameParty.addActor(actorId);
      }),
    );
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

  async serverEncounterRoundResults(roundResults) {
    window.clientAPI.dispatchToReact({
      type: "BottomPanelSlice/setBottomPanel",
      payload: "EncounterReadOutComponent",
    });
    await this.wait(500);
    roundResults.forEach((result) => {
      this[result.action](result);
    });
  }

  Strike(result) {
    window.clientAPI.dispatchToReact({
      type: "encounterSlice/addReadOutMessage",
      payload: result.message,
    });
  }
}

window.clientAPI.encounterManager = new ClientEncounterManager();
