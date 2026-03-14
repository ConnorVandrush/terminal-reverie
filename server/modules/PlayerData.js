class PlayerData
{
    constructor(userId, characterStats, characterData, location)
    {
        this.userId = userId;
        this.characterStats = characterStats;
        this.characterData = characterData;
        this.location = location;
        this.isPartyLeader = false;
        this.isPartyFollower = false;
        this.partyLeaderId = null;
    }
}

module.exports = PlayerData;