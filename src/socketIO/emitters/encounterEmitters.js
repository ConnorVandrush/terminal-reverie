export default async function encounterEmitters(action) 
{
    const socket = window.clientGlobalManager.clientPlayerManager.socket;
    if (action.type === 'encounter/clientAllyTurn') 
    {
        const response = await socket.emitWithAck('clientAllyTurn', action.payload);
        if (response.success) 
        {
            console.log('Ally turn action sent successfully');
        }
        else
        {
            console.error('Failed to send ally turn action');
        }
    }
}
