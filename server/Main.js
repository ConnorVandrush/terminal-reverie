const fs = require('fs');
const path = require('path');

const ServerManager = require('./modules/ServerManager.js');

const serverManager = new ServerManager();

serverManager.connectToDatabase();
serverManager.serveStaticFiles('public');
serverManager.startExpressListeners(15987);
serverManager.startSocketIOListeners();