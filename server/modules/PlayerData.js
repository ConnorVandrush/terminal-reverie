class PlayerData
{
    constructor(characterData)
    {
        this.characterData = characterData;
        this.isTransferring = false;
        this.isBattling = false;
        this.isPartyLeader = false;
        this.isPartyFollower = false;
        this.partyData = 
        {
            partyLeader: null,
            members: []
        }
    }
}

module.exports = PlayerData;