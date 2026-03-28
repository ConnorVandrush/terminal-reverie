import { clientSendPartyInvite } from "@store/partyWindowSlice";

export default function partyWindowEmitters(action)
{
    const socket = window.clientGlobalManager.clientPlayerManager.socket;
    if (action.type === clientSendPartyInvite.type)
    {
        socket.emit('clientSendPartyInvite', action.payload);
    }
}