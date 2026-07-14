import dotenv from "dotenv";
dotenv.config();
import path from "path";
import express from "express";
import { Server } from "socket.io";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export default class ServerManager {
  constructor(api) {
    this.api = api;
    this.app = express();
    this.expressServer;
    this.io;
    this.loginNamespace;
    this.authNamespace;
  }

  connectToDatabase = async () => {
    try {
      await mongoose.connect(process.env.API_KEY);
    } catch (error) {}
  };

  serveStaticFiles = () => {
    this.app.use(express.static("public"));
  };

  startExpressListeners = () => {
    this.expressServer = this.app.listen(
      process.env.BACKEND_PORT,
      "0.0.0.0",
      () => {},
    );
  };

  startSocketIOServer = () => {
    this.io = new Server(this.expressServer, {
      cors: {
        origin: process.env.FRONTEND_ADDRESS,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this.loginNamespace = this.io.of("/login");
    this.authNamespace = this.io.of("/authenticated");

    this.authNamespace.use((socket, next) => {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication failed: No token provided"));
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.characterId = decoded.characterId;
        next();
      } catch (err) {
        next(new Error("Authentication failed: Invalid token"));
      }
    });
  };
}
