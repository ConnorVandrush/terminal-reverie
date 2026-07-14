class ClientPlayerManager {
  constructor() {}

  async login(characterData) {
    const JWT = localStorage.getItem("JWT");
    this.authNamespace = io("http://192.168.1.235:15987/authenticated", {
      auth: { token: JWT },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    const { mapData, tileset, charactersOnMap } =
      await this.authNamespace.emitWithAck("clientLoginToMap");

    console.log(mapData);
    console.log(tileset);

    DataManager.setupNewGame();

    const spritesheet =
      await window.clientAPI.spriteManager.generateBase64pngSpritesheet(
        characterData,
      );

    const bitmap = ImageManager.loadBitmapFromUrl(spritesheet);
    $gamePlayer._customBitmap = bitmap;

    $gameActors
      .actor(1)
      .setCharacterImage(String("$" + characterData.characterId), 0);

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
  }
}

window.clientAPI.playerManager = new ClientPlayerManager();
