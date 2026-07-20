import jwt from "jsonwebtoken";
import argon2 from "argon2";

import PlayerAccounts from "./PlayerAccountModel.js";

export default class ServerPlayerManager {
  constructor(serverAPI) {
    this.serverAPI = serverAPI;
    this.charactersOnline = new Map(); // characterId -> characterData
  }

  isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  isValidPassword = (password) => {
    return password.length >= 8;
  };

  validateEmailAndPassword(email, password, cb) {
    if (!this.isValidEmail(email)) {
      throw new Error("Invalid email format");
    }

    if (!this.isValidPassword(password)) {
      throw new Error("Password must be at least 8 characters long");
    }
  }

  async findUser(email, password, cb) {
    const user = await PlayerAccounts.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }
    return user;
  }

  async assignJWT(user) {
    try {
      const JWT = jwt.sign(
        { characterId: user.playerId },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        },
      );
      user.JWT = JWT;
      await user.save();
    } catch (error) {
      console.log(error);
      throw new Error("An error occurred during login");
    }
  }

  async createAccount(email, password, cb) {
    try {
      const hashedPassword = await argon2.hash(password);

      const newUser = new PlayerAccounts({
        email,
        password: hashedPassword,
      });
      await newUser.save();
      return cb({ success: "Registration successful" });
    } catch (error) {
      console.log(error);
      throw new Error("An error occurred during account creation");
    }
  }

  async createCharacter(user, socket) {
    try {
      const { name, appearance } = await socket.emitWithAck(
        "serverCreateCharacter",
        {},
      );

      user.characterData.characterId = user.playerId;
      user.characterData.name = name;
      user.characterData.appearance = appearance;
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
      console.log(error);
      throw new Error("An error occured during character creation");
    }
  }

  async login(user, socket, cb) {
    try {
      const characterData = user.characterData;
      const JWT = user.JWT;
      this.charactersOnline.set(user.playerId, characterData);
      return cb({ success: true, JWT, characterData });
    } catch (error) {
      console.log(error);
      throw new Error("An error occurred during login.");
    }
  }

  startListeners() {
    this.serverAPI.serverManager.loginNamespace.on("connection", (socket) => {
      socket.on("clientLogin", async ({ email, password }, cb) => {
        try {
          const user = await this.findUser(email, password, cb);
          await this.assignJWT(user);
          if (user.newCharacter) {
            await this.createCharacter(user, socket);
          }
          this.login(user, socket, cb);
        } catch (error) {
          cb({ error: error.message });
        }
      });

      socket.on("clientRegister", async ({ email, password }, cb) => {
        try {
          this.validateEmailAndPassword(email, password, cb);
          const existingUser = await PlayerAccounts.findOne({ email });
          if (existingUser) {
            return cb({ error: "Email already in use" });
          }
          await this.createAccount(email, password, cb);
        } catch (error) {
          cb({ error: error.message });
        }
      });
    });

    this.serverAPI.serverManager.authNamespace.on("connection", (socket) => {
      socket.on("disconnect", async () => {
        const characterId = socket.characterId;
        const characterData = this.charactersOnline.get(characterId);
        this.serverAPI.mapManager.serverCharacterLeftMap(
          socket,
          characterId,
          characterData?.location.map,
        );
        this.charactersOnline.delete(characterId);
      });
    });
  }
}
