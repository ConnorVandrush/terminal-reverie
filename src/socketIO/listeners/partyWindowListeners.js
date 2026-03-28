import { serverSendPartyInvite } from '@store/partyWindowSlice';

export function createPartyWindowListeners(store)
{
    window.clientGlobalManager.clientPlayerManager.socket.on('serverSendPartyInvite', (data) =>
    {
        console.log('Received party invite:', data);
        store.dispatch(serverSendPartyInvite(data));
    });
}