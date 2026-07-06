import jwt from "jsonwebtoken";
import argon2 from "argon2";

import PlayerAccounts from "./PlayerAccountModel";
import PlayerData from "./PlayerData";

export default class ServerPlayerManager {
  constructor(api) {
    this.api = api;
    this.charactersOnline = new Map(); // characterId -> characterData
  }

  async findUser(email, password, cb) {
    try {
      const user = await PlayerAccounts.findOne({ email });
      if (!user) {
        return cb({ error: "Invalid email or password" });
      }
      const isMatch = await argon2.verify(user.password, password);
      if (!isMatch) {
        return cb({ error: "Invalid email or password" });
      }
      return user;
    } catch (error) {
      return cb({ error: "An error occurred during login" });
    }
  }

  async assignJWT(user, cb) {
    try {
      const playerId = user.playerId;
      const JWT = jwt.sign({ playerId }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      user.JWT = JWT;
      await user.save();
    } catch (error) {
      return cb({ error: "An error occurred during login" });
    }
  }

  async createCharacter(user, socket, cb) {
    try {
      const response = await socket.emitWithAck("serverCreateCharacter", {});

      user.characterData.characterId = user.playerId;
      user.characterData.name = response.name;
      user.characterData.appearance = response.appearance;
      user.characterData.location.x = 128;
      user.characterData.location.y = 128;
      user.characterData.location.d = 2;
      user.characterData.location.map = "Area1";
      user.characterData.gold = 100;
      user.characterData.isDead = false;
      user.newCharacter = false;
      user.markModified("characterData");
      await user.save();
    } catch (error) {
      return cb({
        error: "An error occurred during character creation",
      });
    }
  }

  async login(user, socket, cb) {
    this.charactersOnline.set(
      user.characterData.characterId,
      user.characterData,
    );
    this.api.serverMapManager.characterJoinMap(
      socket,
      user.characterData.characterId,
      user.characterData.location.map,
      cb,
    );
  }

  startListeners() {
    this.api.serverManager.loginNamespace.on("connection", (socket) => {
      socket.on("clientLogin", async ({ email, password }, cb) => {
        const user = await this.findUser(email, password, cb);
        await this.assignJWT(user, cb);
        if (user.newCharacter) {
          await this.createCharacter(user, socket, cb);
        }
        this.login(user, socket, cb);
      });
    });
  }
}
