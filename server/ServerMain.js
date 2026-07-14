import ServerServerManager from "./modules/ServerServerManager.js";
import ServerPlayerManager from "./modules/ServerPlayerManager.js";
import ServerMapManager from "./modules/ServerMapManager.js";
import ServerManagerManager from "./modules/ServerManagerManager.js";

const api = new ServerManagerManager();

const serverServerManager = new ServerServerManager(api);
serverServerManager.connectToDatabase();
serverServerManager.serveStaticFiles();
serverServerManager.startExpressListeners();
serverServerManager.startSocketIOServer();

const serverPlayerManager = new ServerPlayerManager(api);

const serverMapManager = new ServerMapManager(api);
serverMapManager.loadMaps();

api.manageManagers(serverServerManager, serverPlayerManager, serverMapManager);

serverPlayerManager.startListeners();
serverMapManager.startListeners();
