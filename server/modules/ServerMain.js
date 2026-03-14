const fs = require('fs');
const path = require('path');

const ServerManager = require('./ServerManager.js');
const serverManager = new ServerManager();
serverManager.connectToDatabase();
serverManager.serveStaticFiles('public');
serverManager.startExpressListeners(15987);
serverManager.startSocketIOServer();

const ServerPlayerManager = require('./ServerPlayerManager.js');
const serverPlayerManager = new ServerPlayerManager();

const ServerLoginManager = require('./ServerLoginManager.js');
const serverLoginManager = new ServerLoginManager(serverManager.publicNamespace, serverManager.io, serverPlayerManager);
serverLoginManager.startListeners();