const express = require("express");
const path = require("path");
const socketio = require("socket.io");
const mongoose = require("mongoose");

class ServerManager {
  constructor() {
    this.app = express();
    this.io;
    this.publicNamespace;
    this.expressServer;
    this.uri = process.env.API_KEY;
  }

  connectToDatabase = async () => {
    try {
      await mongoose.connect(this.uri);
    } catch (error) {
      console.error("Error connecting to database", error);
    }
  };

  serveStaticFiles = (dir) => {
    this.app.use(express.static(path.join(__dirname, "../../", dir)));
  };

  startExpressListeners = (port) => {
    this.expressServer = this.app.listen(port, "0.0.0.0", () => {});
  };

  startSocketIOServer = () => {
    this.io = socketio(this.expressServer, {
      cors: {
        origin: [process.env.VITE_ORIGIN_ADDRESS],
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this.publicNamespace = this.io.of("/login");
  };
}

module.exports = ServerManager;
