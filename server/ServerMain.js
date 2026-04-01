const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

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
serverManager.startExpressListeners(process.env.EXPRESS_PORT);
serverManager.startSocketIOServer();

const ServerPlayerManager = require('./modules/ServerPlayerManager.js');
const serverPlayerManager = new ServerPlayerManager(serverManager.io);

const ServerChatManager = require('./modules/ServerChatManager.js');
const serverChatManager = new ServerChatManager(serverManager.io, serverPlayerManager);
serverChatManager.startListeners();

const ServerPartyManager = require('./modules/ServerPartyManager.js');
const serverPartyManager = new ServerPartyManager(serverManager.io, serverPlayerManager);
serverPartyManager.startListeners();

const ServerMapManager = require('./modules/ServerMapManager.js');
const serverMapManager = new ServerMapManager(serverManager.io, serverPlayerManager, serverPartyManager);
serverMapManager.loadMaps();
serverMapManager.startListeners();

const ServerLoginManager = require('./modules/ServerLoginManager.js');
const serverLoginManager = new ServerLoginManager(serverManager.publicNamespace, serverManager.io, serverPlayerManager, serverMapManager);
serverLoginManager.startListeners();