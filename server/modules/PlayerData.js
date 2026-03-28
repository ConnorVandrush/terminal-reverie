class PlayerData
{
    constructor(characterData)
    {
        this.socketId = null;
        this.characterData = characterData;
        this.isTransferring = false;
        this.isBattling = false;
        this.partyData = 
        {
            partyLeaderId: null,
            members: []
        }
    }
}

module.exports = PlayerData;