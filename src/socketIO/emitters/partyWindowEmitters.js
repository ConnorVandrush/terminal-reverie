import { clientSendPartyInvite, setErrorMessage, setSuccessMessage, clientAcceptPartyInvite, clientLeaveParty, clientKickPartyMember } from "@store/partyWindowSlice";
import { removePartyInvite } from "../../store/partyWindowSlice";

export default async function partyWindowEmitters(action, store)
{
    const socket = window.clientGlobalManager.clientPlayerManager.socket;
    if (action.type === clientSendPartyInvite.type)
    {
        const response = await socket.emitWithAck('clientSendPartyInvite', action.payload);

        if (response.success)
        {
            store.dispatch(setSuccessMessage(response.message));
            store.dispatch(setErrorMessage(false));
        }
        else
        {
            store.dispatch(setErrorMessage(response.message));
            store.dispatch(setSuccessMessage(false));
        }
    }

    if (action.type === clientAcceptPartyInvite.type)
    {
        const response = await socket.emitWithAck('clientAcceptPartyInvite', action.payload);

        if (response.success)
        {
            store.dispatch(setSuccessMessage(response.message));
            store.dispatch(setErrorMessage(false));
            store.dispatch(removePartyInvite(action.payload));
        }
        else
        {
            store.dispatch(setErrorMessage(response.message));
            store.dispatch(setSuccessMessage(false));
        }
    }

    if (action.type === clientLeaveParty.type)
    {
        const response = await socket.emitWithAck('clientLeaveParty', action.payload);

        if (response.success)        
        {
            store.dispatch(setSuccessMessage(response.message));
            store.dispatch(setErrorMessage(false));
            const characterData = window.clientGlobalManager.clientPartyManager.partyData?.members.find(m => m.playerId === window.clientGlobalManager.clientPlayerManager.characterData.playerId);
            window.clientGlobalManager.clientPartyManager.partyData = { members: characterData ? [characterData] : [] };
            store.dispatch({ type: 'partyWindow/setPartyData', payload: { members: characterData ? [characterData] : [] } });
        }
        else
        {
            store.dispatch(setErrorMessage(response.message));
            store.dispatch(setSuccessMessage(false));
        }
    }

    if (action.type === clientKickPartyMember.type)
    {
        const response = await socket.emitWithAck('clientKickPartyMember', action.payload);

        if (response.success)        
        {
            store.dispatch(setSuccessMessage(response.message));
            store.dispatch(setErrorMessage(false));
        }
        else        
        {
            store.dispatch(setErrorMessage(response.message));
            store.dispatch(setSuccessMessage(false));
        }
    }
}