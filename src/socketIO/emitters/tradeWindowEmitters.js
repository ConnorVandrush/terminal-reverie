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
        const tradePartner = store.getState().tradeWindow.tradePartner;
        const response = await socket.emitWithAck('clientTradeDeclined', { tradePartner });
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
    else if (action.type === 'tradeWindow/clientOfferItemInTrade')
    {
        const tradePartner = store.getState().tradeWindow.tradePartner;

        const { itemId, itemName, qty } = action.payload;

        const response = await socket.emitWithAck('clientOfferItemInTrade', {
            itemId,
            itemName,
            qty,
            tradePartner
        });

        if (!response.success)
        {
            store.dispatch({ type: 'tradeWindow/setErrorMessage', payload: response.message });
            store.dispatch({ type: 'tradeWindow/setSuccessMessage', payload: null });
        }
        else
        {
            store.dispatch({ type: 'tradeWindow/setErrorMessage', payload: null });
            store.dispatch({ type: 'tradeWindow/setSuccessMessage', payload: response.message });

            // Update your offer items in Redux
            store.dispatch({
                type: 'tradeWindow/setYourOfferItems',
                payload: { itemId, itemName, qty }
            });
        }
    }
    else if (action.type === 'tradeWindow/clientOfferGoldInTrade')
    {
        const tradePartner = store.getState().tradeWindow.tradePartner;
        const response = await socket.emitWithAck('clientOfferGoldInTrade', { amt: action.payload, tradePartner: tradePartner });
        if (!response.success)
        {
            store.dispatch({ type: 'tradeWindow/setErrorMessage', payload: response.message });
            store.dispatch({ type: 'tradeWindow/setSuccessMessage', payload: null });
        }
        if (response.success)
        {
            store.dispatch({ type: 'tradeWindow/setErrorMessage', payload: null });
            store.dispatch({ type: 'tradeWindow/setSuccessMessage', payload: response.message });
            store.dispatch({ type: 'tradeWindow/setYourOfferGold', payload: action.payload });
        }
    }
    else if (action.type === 'tradeWindow/clientTradeAccepted')
    {
        const tradePartner = store.getState().tradeWindow.tradePartner;
        const theirOfferGold = store.getState().tradeWindow.theirOfferGold;
        const theirOfferItems = store.getState().tradeWindow.theirOfferItems;
        const yourOfferGold = store.getState().tradeWindow.yourOfferGold;
        const yourOfferItems = store.getState().tradeWindow.yourOfferItems;

        const convertToArray = (obj) =>
            Object.entries(obj).map(([itemId, data]) => ({
                itemId,
                itemName: data.itemName,
                qty: data.qty
            }));

        const payload = {
            tradePartner,
            theirOfferGold,
            theirOfferItems: convertToArray(theirOfferItems),
            yourOfferGold,
            yourOfferItems: convertToArray(yourOfferItems)
        };

        const response = await socket.emitWithAck('clientTradeAccepted', payload);

        if (!response.success)
        {
            store.dispatch({ type: 'tradeWindow/setErrorMessage', payload: response.message });
            store.dispatch({ type: 'tradeWindow/setSuccessMessage', payload: null });
        }
        else
        {
            store.dispatch({ type: 'tradeWindow/setErrorMessage', payload: null });
            store.dispatch({ type: 'tradeWindow/setSuccessMessage', payload: response.message });
        }
    }

}