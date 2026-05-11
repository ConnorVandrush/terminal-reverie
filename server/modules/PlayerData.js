class PlayerData
{
    constructor(characterData)
    {
        this.socketId = null;
        this.characterData = characterData;
        this.preventMovement = false;
        this.isTransferring = false;
        this.inEncounter = false;
        this.isBusy = false;
        this.partyData = 
        {
            partyLeaderId: null,
            members: []
        }
    }
}

module.exports = PlayerData;