export default async function inventoryEmitters(action, store) 
{
    const socket = window.clientGlobalManager.clientPlayerManager.socket;
    if (action.type === 'inventory/clientUseItem') 
    {
        const response = await socket.emitWithAck('clientUseItem', action.payload);

        if (response.success)
        {
            const index = window.clientGlobalManager.clientPartyManager.partyData.members.findIndex(member => member.playerId === response.updatedTarget.playerId);
            window.clientGlobalManager.clientPartyManager.partyData.members[index] = response.updatedTarget;
            const partyDataClone = structuredClone(window.clientGlobalManager.clientPartyManager.partyData);
            store.dispatch({ type: 'partyWindow/setPartyData', payload: partyDataClone });
            store.dispatch({ type: 'inventory/setInventory', payload: response.updatedInventory });
        }
    }
}
