const mongoose = require("mongoose");
const CharacterData = require("./CharacterData.js");

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // name of the counter, e.g. "characterId"
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

const playerAccountSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  playerId: { type: Number, unique: true },
  JWT: { type: String },
  characterData: { type: Object, default: () => new CharacterData() },
  location: { type: Object, default: {} },
  isDead: { type: Boolean, default: true },
});

playerAccountSchema.pre("save", async function () {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: "playerId" }, // counter name
        { $inc: { seq: 1 } }, // increment by 1
        { new: true, upsert: true }, // create if not exists
      );

      this.playerId = counter.seq;
    } catch (err) {
      throw err;
    }
  } else {
    return;
  }
});

let PlayerAccountModel = mongoose.models.PlayerAccount;

if (!PlayerAccountModel) {
  PlayerAccountModel = mongoose.model("PlayerAccount", playerAccountSchema);
}

module.exports = PlayerAccountModel;
