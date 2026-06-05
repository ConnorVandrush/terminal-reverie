const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// // FIXME
// const { saveColorPixelRangesToJson } = require('./modules/SharpColorFinder.js');
// // Example usage
// saveColorPixelRangesToJson(
//     './server/modules/GrasslanderBattle.png',
//     './colorPixelRanges.json'
// );

const ServerManager = require("./modules/ServerManager.js");
const serverManager = new ServerManager();
serverManager.connectToDatabase();
serverManager.serveStaticFiles("public");
serverManager.startExpressListeners(process.env.EXPRESS_PORT);
serverManager.startSocketIOServer();

const ServerPlayerManager = require("./modules/ServerPlayerManager.js");
const serverPlayerManager = new ServerPlayerManager(serverManager.io);

const ServerChatManager = require("./modules/ServerChatManager.js");
const serverChatManager = new ServerChatManager(
  serverManager.io,
  serverPlayerManager,
);
serverChatManager.startListeners();

const ServerPartyManager = require("./modules/ServerPartyManager.js");
const serverPartyManager = new ServerPartyManager(
  serverManager.io,
  serverPlayerManager,
);
serverPartyManager.startListeners();

const ServerEncounterManager = require("./modules/ServerEncounterManager.js");
const serverEncounterManager = new ServerEncounterManager(
  serverManager.io,
  serverPlayerManager,
  serverPartyManager,
);
serverEncounterManager.loadTroops();
serverEncounterManager.loadEnemies();
serverEncounterManager.loadEncounterTables();
serverEncounterManager.startListeners();

const ServerMapManager = require("./modules/ServerMapManager.js");
const serverMapManager = new ServerMapManager(
  serverManager.io,
  serverPlayerManager,
  serverPartyManager,
  serverEncounterManager,
);
serverMapManager.loadMaps();
serverMapManager.startListeners();
serverEncounterManager.setServerMapManager(serverMapManager);

const ServerInventoryManager = require("./modules/ServerInventoryManager.js");
const serverInventoryManager = new ServerInventoryManager(
  serverManager.io,
  serverPlayerManager,
  serverPartyManager,
  serverMapManager,
);
serverInventoryManager.loadItems();
serverInventoryManager.loadShops();
serverInventoryManager.startListeners();

const ServerLoginManager = require("./modules/ServerLoginManager.js");
const serverLoginManager = new ServerLoginManager(
  serverManager.publicNamespace,
  serverManager.io,
  serverPlayerManager,
  serverMapManager,
  serverPartyManager,
  serverInventoryManager,
);
serverLoginManager.startListeners();
