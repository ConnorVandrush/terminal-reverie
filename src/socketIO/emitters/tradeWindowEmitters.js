export default async function tradeWindowEmitters(action, store) 
{
    const socket = window.clientGlobalManager.clientPlayerManager.socket;
    if (action.type === 'tradeWindow/clientSendTradeRequest') 
    {
        const response = await socket.emitWithAck('clientSendTradeRequest', { toPlayerName: action.payload });
        if (response.success)
        {
            store.dispatch({ type: 'tradeWindow/setSuccessMessage', payload: response.message });
            store.dispatch({ type: 'tradeWindow/setErrorMessage', payload: null });
        }
        else
        {
            store.dispatch({ type: 'tradeWindow/setErrorMessage', payload: response.message });
            store.dispatch({ type: 'tradeWindow/setSuccessMessage', payload: null });
        }
    }
    else if (action.type === 'tradeWindow/clientAcceptTradeRequest')
    {
        window.clientGlobalManager.clientMapManager.isMoving = true;
        const response = await socket.emitWithAck('clientAcceptTradeRequest', { fromPlayerName: action.payload });
        if (response.success)        
        {
            store.dispatch({ type: 'centerPanel/setCenterPanel', payload: 'tradeWindow' });
            store.dispatch({ type: 'tradeWindow/setSuccessMessage', payload: null });
            store.dispatch({ type: 'tradeWindow/setErrorMessage', payload: null });
            store.dispatch({ type: 'tradeWindow/serverTradeRequestAccepted', payload: { fromPlayerName: action.payload } });
        }
        else        
        {
            store.dispatch({ type: 'tradeWindow/setErrorMessage', payload: response.message });
            store.dispatch({ type: 'tradeWindow/setSuccessMessage', payload: null });
        }
    }
    else if (action.type === 'tradeWindow/clientTradeDeclined')
    {
        const response = await socket.emitWithAck('clientTradeDeclined', { tradePartner: action.payload });
        if (response.success)
        {
            store.dispatch({ type: 'centerPanel/setCenterPanel', payload: null });
            store.dispatch({ type: 'tradeWindow/setTradePartner', payload: null });
            store.dispatch({ type: 'tradeWindow/setTheirOffer', payload: [] });
            store.dispatch({ type: 'tradeWindow/setYourOffer', payload: [] });
            store.dispatch({ type: 'tradeWindow/setSuccessMessage', payload: null });
            store.dispatch({ type: 'tradeWindow/setErrorMessage', payload: null });
            window.clientGlobalManager.clientMapManager.isMoving = false;
        }
        else
        {
            store.dispatch({ type: 'tradeWindow/setErrorMessage', payload: response.message });
            store.dispatch({ type: 'tradeWindow/setSuccessMessage', payload: null });
        }
    }
}