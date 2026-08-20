class ClientEncounterManager {
  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  findCombatant(id) {
    const actor = $gameParty
      .members()
      .find((actor) => actor.characterId === id);

    if (actor) {
      return actor;
    }

    const enemy = $gameTroop
      .members()
      .find((enemy) => enemy.enemyInstanceId === id);

    return enemy || null;
  }

  syncCombatantToReact(target, result) {
    const state = window.clientAPI.getReactState();

    if (target.isEnemy()) {
      const enemyIndex = $gameTroop.members().indexOf(target);

      if (enemyIndex === -1) return;

      const enemyData = state.EncounterSlice.enemies[enemyIndex];

      if (!enemyData) return;

      window.clientAPI.dispatchToReact({
        type: "EncounterSlice/setEnemyData",
        payload: {
          enemyIndex,
          enemyData: {
            ...enemyData,
            currentHp: Math.max(0, enemyData.currentHp - result.damage),
          },
        },
      });

      return;
    }

    if (target.isActor()) {
      const playerIndex = $gameParty.members().indexOf(target);

      if (playerIndex === -1) return;

      const playerData = state.PartySlice.partyMembers[playerIndex];

      if (!playerData) return;

      window.clientAPI.dispatchToReact({
        type: "PartySlice/setPlayerHp",
        payload: {
          playerIndex,
          currentHp: Math.max(0, playerData.currentHp - result.damage),
        },
      });
    }
  }

  checkIfDead() {
    const state = window.clientAPI.getReactState();

    const players = state.PartySlice.partyMembers;
    const enemies = state.EncounterSlice.enemies;

    $gameParty.members().forEach((member, index) => {
      const playerData = players[index];

      if (!playerData) return;

      if (playerData.currentHp <= 0) {
        member.setHp(0);
        member.addState(member.deathStateId());
        member.performCollapse();
      }
    });

    const deadEnemyIndexes = [];

    $gameTroop.members().forEach((enemy, index) => {
      const enemyData = enemies[index];

      if (!enemyData) return;

      if (enemyData.currentHp <= 0) {
        enemy.setHp(0);
        enemy.addState(enemy.deathStateId());
        enemy.performCollapse();
        window.clientAPI.dispatchToReact({
          type: "EncounterSlice/addEncounterMessage",
          payload: `${enemyData.name} was defeated.`,
        });

        deadEnemyIndexes.push(index);
      }
    });

    // Remove from highest index to lowest so the indexes
    // don't shift before we remove the remaining dead enemies.
    deadEnemyIndexes
      .sort((a, b) => b - a)
      .forEach((enemyIndex) => {
        window.clientAPI.dispatchToReact({
          type: "EncounterSlice/removeEnemy",
          payload: enemyIndex,
        });
      });
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
        actor.characterId = member.characterId;
        const sprite =
          await window.clientAPI.spriteManager.generateBase64pngSpritesheet(
            member.appearance,
            "Battler",
          );
        if (sprite && actor) {
          const bitmap = ImageManager.loadBitmapFromUrl(sprite);
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
    $gameTroop.members().forEach((enemy, index) => {
      const enemyData = rmmzEnemyData[index];

      if (enemyData) {
        enemy.enemyInstanceId = enemyData.enemyInstanceId;
      }
    });
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
    await this.wait(500);

    for (const result of roundResults) {
      await this[result.action](result);
      await this.wait(2000);
    }
  }

  async Strike(result) {
    window.clientAPI.dispatchToReact({
      type: "EncounterSlice/addEncounterMessage",
      payload: result.message,
    });
    const combatant = this.findCombatant(result.combatantId);
    const target = this.findCombatant(result.targetId);
    this.syncCombatantToReact(target, result);
    await this.wait(300);
    if (combatant.isActor()) {
      combatant.performAttack();
    } else {
      const enemySprite = BattleManager._spriteset._enemySprites.find(
        (sprite) => sprite._enemy === combatant,
      );
      enemySprite.startEffect("whiten");
    }
    await this.wait(300);
    target.gainHp(-result.damage);
    target.startDamagePopup();
    target.performDamage();
    await this.wait(500);
    this.checkIfDead();
  }
}

window.clientAPI.encounterManager = new ClientEncounterManager();
