class ClientEncounterManager 
{
    constructor()
    {
    }

    startEncounter(encounterData)
    {
        console.log("Starting encounter with data:", encounterData);
    }
}

window.clientGlobalManager.clientEncounterManager = new ClientEncounterManager();