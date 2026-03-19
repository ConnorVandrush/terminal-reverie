const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../variables.env') });

// FIXME 
// const { saveWhitePixelRangesToJson } = require('./modules/SharpColorFinder.js');
// // Example usage
// saveWhitePixelRangesToJson(
//     './server/modules/Grasslands.png',
//     './whitePixelRanges.json'
// );

const ServerManager = require('./modules/ServerManager.js');
const serverManager = new ServerManager();
serverManager.connectToDatabase();
serverManager.serveStaticFiles('public');
serverManager.startExpressListeners(15987);
serverManager.startSocketIOServer();

const ServerMapManager = require('./modules/ServerMapManager.js');
const serverMapManager = new ServerMapManager();
serverMapManager.loadMaps();

const ServerPlayerManager = require('./modules/ServerPlayerManager.js');
const serverPlayerManager = new ServerPlayerManager();

const ServerLoginManager = require('./modules/ServerLoginManager.js');
const serverLoginManager = new ServerLoginManager(serverManager.publicNamespace, serverManager.io, serverPlayerManager, serverMapManager);
serverLoginManager.startListeners();