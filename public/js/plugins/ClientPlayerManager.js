class ClientPlayerManager {
  constructor() {
    this.characterCanMove = true;
  }

  async login(characterData) {
    const JWT = localStorage.getItem("JWT");
    window.clientAPI.authNamespace = io(
      "http://192.168.1.235:15987/authenticated",
      {
        auth: { token: JWT },
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
      },
    );

    const { mapData, tileset, charactersOnMap } =
      await window.clientAPI.authNamespace.emitWithAck("clientLoginToMap");

    DataManager.setupNewGame();

    const spritesheet =
      await window.clientAPI.spriteManager.generateBase64pngSpritesheet(
        characterData.appearance,
      );

    const bitmap = ImageManager.loadBitmapFromUrl(spritesheet);
    $gamePlayer._customBitmap = bitmap;

    $dataTilesets[mapData.tilesetId] = structuredClone(tileset);
    const map = structuredClone(mapData);
    map.id = Date.now(); // Unique ID forces reload, if we reuse the same map id it doesn't load properly
    $dataMap = map;

    $gamePlayer.reserveTransfer(
      map.id,
      characterData.location.x,
      characterData.location.y,
      characterData.location.d,
      0,
    );
    SceneManager.goto(Scene_Map);
    window.clientAPI.dispatchToReact({
      type: "RightPanelSlice/setRightPanel",
      payload: null,
    });
    window.clientAPI.dispatchToReact({
      type: "LeftPanelSlice/setLeftPanel",
      payload: "Controls",
    });
    window.clientAPI.dispatchToReact({
      type: "CenterPanelSlice/setCenterPanel",
      payload: null,
    });
    window.clientAPI.dispatchToReact({
      type: "BottomPanelSlice/setBottomPanel",
      payload: null,
    });
  }

  // see engine overrides
  async clientRequestMove(direction, oldLoc) {
    try {
      const { success, newLocation } =
        await window.clientAPI.authNamespace.emitWithAck(
          "clientRequestMove",
          direction,
        );
      console.log(success);
      if (!success) {
        $gamePlayer.locate(oldLoc.x, oldLoc.y);
        $gamePlayer.setDirection(oldLoc.d);
      } else {
        window.clientAPI.dispatchToReact({
          type: "partySlice/setMember1CharacterLocation",
          payload: newLocation,
        });
      }
    } catch (error) {
      $gamePlayer.locate(oldLoc.x, oldLoc.y);
      $gamePlayer.setDirection(oldLoc.d);
    }
  }
}

window.clientAPI.playerManager = new ClientPlayerManager();
