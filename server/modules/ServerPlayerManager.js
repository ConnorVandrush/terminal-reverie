import jwt from "jsonwebtoken";
import argon2 from "argon2";
import CharacterData from "./CharacterData.js";

import PlayerAccounts from "./PlayerAccountModel.js";

export default class ServerPlayerManager {
  constructor(serverAPI) {
    this.serverAPI = serverAPI;
    this.charactersOnline = new Map(); // characterId -> characterData
    this.characterNamesOnline = new Map(); // characterName -> characterData
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
      user.characterData.mani = 100;
      user.characterData.isDead = false;
      user.newCharacter = false;
      for (const [slot, equipmentId] of Object.entries(
        user.characterData.equipment,
      )) {
        user.characterData.equipment[slot] =
          this.serverAPI.inventoryManager.getItemData(Number(equipmentId));
      }
      user.markModified("characterData");
      await user.save();
    } catch (error) {
      console.log(error);
      throw new Error("An error occured during character creation");
    }
  }

  async login(user, socket, cb) {
    try {
      const characterData = new CharacterData();

      Object.assign(characterData, user.characterData);

      const JWT = user.JWT;

      this.charactersOnline.set(user.playerId, characterData);
      this.characterNamesOnline.set(characterData.name, characterData);

      this.serverAPI.inventoryManager.addItemToInventory(user.playerId, 5);

      characterData.partyRoom = "partyRoom" + user.playerId;
      characterData.partyMemberIds.push(user.playerId);

      return cb({
        success: true,
        JWT,
        characterData,
      });
    } catch (error) {
      console.log(error);
      throw new Error("An error occurred during login.");
    }
  }

  getPartyMemberData(partyMemberIds) {
    return Array.from({ length: 4 }, (_, index) => {
      const memberId = partyMemberIds[index];

      return this.charactersOnline.get(memberId) ?? null;
    });
  }

  checkOrthogonalAdjacency(characterId1, characterId2) {
    const p1 = this.charactersOnline.get(characterId1);
    const p2 = this.charactersOnline.get(characterId2);
    if (!p1 || !p2) return false;

    const x1 = p1.location.x;
    const y1 = p1.location.y;
    const x2 = p2.location.x;
    const y2 = p2.location.y;

    const dx = Math.abs(x1 - x2);
    const dy = Math.abs(y1 - y2);

    // Same tile OR orthogonally adjacent
    return (
      (dx === 0 && dy === 0) || (dx === 1 && dy === 0) || (dx === 0 && dy === 1)
    );
  }

  assembleParty(partyLeaderId) {
    const partyLeaderData = this.charactersOnline.get(partyLeaderId);
    for (const memberId of partyLeaderData.partyMemberIds) {
      const member = this.charactersOnline.get(memberId);
      member.canMove = false;
      member.partyMemberIds = [...partyLeaderData.partyMemberIds];
      member.partyRoom = partyLeaderData.partyRoom;
      member.location = { ...partyLeaderData.location };
      this.serverAPI.serverManager.authNamespace
        .to(member.location.map)
        .emit("serverRemoteCharacterMoved", {
          characterId: member.characterId,
          newLocation: member.location,
        });
      const socket = this.serverAPI.serverManager.authNamespace.sockets.get(
        member.socketId,
      );
      if (socket) {
        socket.join(partyLeaderData.partyRoom);
      }
      setTimeout(() => {
        member.canMove = true;
      }, 3000);
    }
  }

  joinParty(partyLeaderId, joiningCharacterId, cb) {
    const partyLeaderData = this.charactersOnline.get(partyLeaderId);
    if (!this.checkOrthogonalAdjacency(partyLeaderId, joiningCharacterId)) {
      return cb({
        success: false,
        message: "You must be adjacent to the party leader to join their party",
      });
    }
    if (!partyLeaderData.sentPartyInvitations.includes(joiningCharacterId)) {
      throw new Error("Sent invitation not found");
    } else {
      partyLeaderData.sentPartyInvitations =
        partyLeaderData.sentPartyInvitations.filter(
          (x) => x !== joiningCharacterId,
        );
    }
    partyLeaderData.partyMemberIds.push(joiningCharacterId);
    this.assembleParty(partyLeaderId);
    this.serverAPI.serverManager.authNamespace
      .to(partyLeaderData.partyRoom)
      .emit(
        "serverSyncPartyData",
        this.getPartyMemberData(partyLeaderData.partyMemberIds),
      );
  }

  leaveParty(characterId) {
    const characterData = this.charactersOnline.get(characterId);
    const newParty = characterData.partyMemberIds.filter(
      (x) => x !== characterId,
    );
    const partyLeaderData = this.charactersOnline.get(newParty[0]);
    partyLeaderData.partyMemberIds = newParty;
    partyLeaderData.partyRoom = "partyRoom" + partyLeaderData.characterId;
    this.assembleParty(newParty[0]);
    this.serverAPI.serverManager.authNamespace
      .to(partyLeaderData.partyRoom)
      .emit(
        "serverSyncPartyData",
        this.getPartyMemberData(partyLeaderData.partyMemberIds),
      );
    characterData.partyMemberIds = [characterId];
    characterData.partyRoom = "partyRoom" + characterId;
    this.serverAPI.serverManager.authNamespace
      .to(characterData.partyRoom)
      .emit(
        "serverSyncPartyData",
        this.getPartyMemberData(partyLeaderData.partyMemberIds),
      );
  }

  serverSyncPartyData(socket) {
    const characterData = this.charactersOnline.get(socket.characterId);

    if (!characterData) {
      return;
    }

    const partyData = this.getPartyMemberData(characterData.partyMemberIds);

    socket.emit("serverSyncPartyData", partyData);
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
          console.error(error);
          cb({ error: "error.message" });
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
          console.error(error);
          cb({ error: error.message });
        }
      });
    });

    this.serverAPI.serverManager.authNamespace.on("connection", (socket) => {
      const characterData = this.charactersOnline.get(socket.characterId);
      characterData.socketId = socket.id;
      socket.join(characterData.partyRoom);

      socket.on("clientSendPartyInvite", (nameOfPartyInviteRecipient, cb) => {
        try {
          const characterData = this.charactersOnline.get(socket.characterId);
          const recipient = this.characterNamesOnline.get(
            nameOfPartyInviteRecipient,
          );
          if (!recipient)
            return cb({ success: false, message: "Name not online" });
          this.serverAPI.serverManager.authNamespace
            .to(recipient.socketId)
            .emit("serverDeliverPartyInvite", {
              senderId: characterData.characterId,
              senderName: characterData.name,
            });
          characterData.sentPartyInvitations.push(recipient.characterId);
          return cb({ success: true, message: "Invite sent" });
        } catch (error) {
          console.error(error);
          cb({ success: false, message: "Invite failed" });
        }
      });

      socket.on("clientAcceptPartyInvite", (partyLeaderId, cb) => {
        try {
          this.joinParty(partyLeaderId, socket.characterId, cb);
          cb({ success: true, message: "Joined party" });
        } catch (error) {
          console.error(error);
          cb({ success: false, message: "Failed to join party" });
        }
      });

      socket.on("clientLeaveParty", () => {
        try {
          this.leaveParty(socket.characterId);
        } catch (error) {
          console.error(error);
        }
      });

      socket.on("disconnect", async () => {
        const characterId = socket.characterId;
        const characterData = this.charactersOnline.get(characterId);
        if (characterData.partyMemberIds.length >= 2)
          this.leaveParty(characterId);
        this.serverAPI.mapManager.serverCharacterLeftMap(
          socket,
          characterId,
          characterData?.location.map,
        );
        this.charactersOnline.delete(characterId);
        this.characterNamesOnline.delete(characterData.name);

        characterData.partyRoom = null;
        characterData.partyMemberIds = [];
        characterData.sentPartyInvitations = [];
        characterData.tradeOffer = null;
        characterData.canMove = true;
        characterData.canTransfer = true;

        const existingUser = await PlayerAccounts.findOne({ characterId });
        if (existingUser) {
          existingUser.JWT = null;
          await existingUser.save();
        }
      });
    });
  }
}
