import jwt from "jsonwebtoken";
import argon2 from "argon2";

import PlayerAccounts from "./PlayerAccountModel.js";

export default class ServerPlayerManager {
  constructor(serverAPI) {
    this.serverAPI = serverAPI;
    this.charactersOnline = new Map(); // characterId -> characterData
    this.characterNamesOnline = new Map(); // characterName -> characterData
    this.partiesOnline = new Map(); // partyLeaderCharacterId -> { characterDatas... }
  }

  isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  isValidPassword = (password) => {
    return password.length >= 8;
  };

  validateEmailAndPassword(email, password) {
    if (!this.isValidEmail(email)) {
      throw new Error("Invalid email format");
    }

    if (!this.isValidPassword(password)) {
      throw new Error("Password must be at least 8 characters long");
    }
  }

  async findUser(email, password) {
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
      this.characterNamesOnline.set(characterData.name, characterData);
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
          const user = await this.findUser(email, password);
          await this.assignJWT(user);
          if (user.newCharacter) {
            await this.createCharacter(user, socket);
          }
          await this.login(user, socket, cb);
        } catch (error) {
          cb({ error: error.message });
        }
      });

      socket.on("clientRegister", async ({ email, password }, cb) => {
        try {
          this.validateEmailAndPassword(email, password);
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
      const characterData = this.charactersOnline.get(socket.characterId);
      characterData.socketId = socket.id;

      socket.on("clientSendPartyInvite", (nameOfPartyInviteRecipient, cb) => {
        const characterData = this.charactersOnline.get(socket.characterId);
        const recepient = this.characterNamesOnline.get(
          nameOfPartyInviteRecipient,
        );
        if (!recepient)
          return cb({ success: false, message: "Name not online" });
        this.serverAPI.serverManager.authNamespace
          .to(recepient.socketId)
          .emit("serverDeliverPartyInvite", {
            senderId: characterData.characterId,
            senderName: characterData.name,
          });
        return cb({ success: true, message: "Invite sent" });
      });
      socket.on("disconnect", () => {
        const characterId = socket.characterId;
        const characterData = this.charactersOnline.get(characterId);
        this.serverAPI.mapManager.serverCharacterLeftMap(
          socket,
          characterId,
          characterData?.location.map,
        );
        this.charactersOnline.delete(characterId);
        this.characterNamesOnline.delete(characterData.name);
      });
    });
  }
}
