import ServerServerManager from "./modules/ServerServerManager.js";
import ServerPlayerManager from "./modules/ServerPlayerManager.js";
import ServerMapManager from "./modules/ServerMapManager.js";
import ServerManagerManager from "./modules/ServerManagerManager.js";

const serverAPI = new ServerManagerManager();

const serverServerManager = new ServerServerManager(serverAPI);
serverServerManager.connectToDatabase();
serverServerManager.serveStaticFiles();
serverServerManager.startExpressListeners();
serverServerManager.startSocketIOServer();

const serverPlayerManager = new ServerPlayerManager(serverAPI);

const serverMapManager = new ServerMapManager(serverAPI);
serverMapManager.loadMaps();

serverAPI.manageManagers(
  serverServerManager,
  serverPlayerManager,
  serverMapManager,
);

serverPlayerManager.startListeners();
serverMapManager.startListeners();
