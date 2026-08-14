import ServerServerManager from "./modules/ServerServerManager.js";
import ServerPlayerManager from "./modules/ServerPlayerManager.js";
import ServerMapManager from "./modules/ServerMapManager.js";
import ServerManagerManager from "./modules/ServerManagerManager.js";
import ServerEncounterManager from "./modules/ServerEncounterManager.js";
import ServerInventoryManager from "./modules/ServerInventoryManager.js";

const serverAPI = new ServerManagerManager();

const serverServerManager = new ServerServerManager(serverAPI);
serverServerManager.connectToDatabase();
serverServerManager.serveStaticFiles();
serverServerManager.startExpressListeners();
serverServerManager.startSocketIOServer();

const serverPlayerManager = new ServerPlayerManager(serverAPI);

const serverMapManager = new ServerMapManager(serverAPI);
serverMapManager.loadTroops();
serverMapManager.loadEnemies();
serverMapManager.loadMaps();

const serverEncounterManager = new ServerEncounterManager(serverAPI);

const serverInventoryManager = new ServerInventoryManager(serverAPI);

serverAPI.manageManagers(
  serverServerManager,
  serverPlayerManager,
  serverMapManager,
  serverEncounterManager,
  serverInventoryManager,
);

serverPlayerManager.startListeners();
serverMapManager.startListeners();
serverEncounterManager.startListeners();
