export default class PlayerData {
  constructor(characterData) {
    this.socketId = null;
    this.characterData = characterData;
    this.preventMovement = false;
    this.isTransferring = false;
    this.inEncounter = false;
    this.isBusy = false;
  }
}
