export default async function encounterEmitters(action) 
{
    const socket = window.clientGlobalManager.clientPlayerManager.socket;
    if (action.type === 'encounter/clientAllyTurn') 
    {
        socket.emit('clientAllyTurn', action.payload);
    }
}
