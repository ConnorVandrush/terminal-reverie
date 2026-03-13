const fs = require('fs');
const path = require('path');

const ServerManager = require('./ServerManager.js');
const ServerLoginManager = require('./ServerLoginManager.js');

const serverManager = new ServerManager();
serverManager.connectToDatabase();
serverManager.serveStaticFiles('public');
serverManager.startExpressListeners(15987);
serverManager.startSocketIOServer();

const serverLoginManager = new ServerLoginManager(serverManager.publicNamespace);
serverLoginManager.startListeners();