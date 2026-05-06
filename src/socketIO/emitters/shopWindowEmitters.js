export default async function shopWindowEmitters(action, store) 
{
    const socket = window.clientGlobalManager.clientPlayerManager.socket;
    if (action.type === 'shopWindow/clientRequestOpenShop') 
    {
        const response = await socket.emitWithAck('clientRequestOpenShop');

        if (response.success)
        {
            store.dispatch({ type: 'shopWindow/setShopInventory', payload: response.shopInventory });
            store.dispatch({ type: 'centerPanel/setCenterPanel', payload: 'shopWindow' });
        }
    }
    else if (action.type === 'shopWindow/clientRequestCloseShop') 
    {
        const response = await socket.emitWithAck('clientRequestCloseShop');

        if (response.success)
        {
            store.dispatch({ type: 'centerPanel/setCenterPanel', payload: null });
            store.dispatch({ type: 'shopWindow/setShopInventory', payload: {} });
            store.dispatch({ type: 'shopWindow/setSelectedShopItem', payload: null });
            store.dispatch({ type: 'shopWindow/setMessage', payload: null });
            window.clientGlobalManager.clientMapManager.isMoving = false;
        }
    }
    else if (action.type === 'shopWindow/clientBuyItem')
    {
        const response = await socket.emitWithAck('clientBuyItem', action.payload);
        if (response.success) 
        {
            window.clientGlobalManager.clientPlayerManager.updatePlayerCharacterData(response.characterData);
        }
        else
        {
            store.dispatch({ type: 'shopWindow/setMessage', payload: response.message });
        }
    }
}
