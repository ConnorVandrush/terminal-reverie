class PlayerData
{
    constructor(playerId, characterStats, characterData, location)
    {
        this.playerId = playerId;
        this.characterStats = characterStats;
        this.characterData = characterData;
        this.location = location;
        this.isPartyLeader = false;
        this.isPartyFollower = false;
        this.partyLeaderId = null;
    }
}

module.exports = PlayerData;