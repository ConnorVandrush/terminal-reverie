class ClientShopManager 
{
    constructor() 
    {
        this.socket = window.socket;

        const _doBuy = Scene_Shop.prototype.doBuy;
        Scene_Shop.prototype.doBuy = function(number) 
        {
            window.clientGlobalManager.clientPlayerManager.socket.emitWithAck("clientBuyItem", 
            {
                itemId: this._item.id,
                quantity: number
            }).then((response) => 
            {
                if (response.success) 
                {
                    window.clientGlobalManager.clientPlayerManager.updatePlayerCharacterData(response.characterData);
                }
                else
                {
                    return;
                }
            });
            _doBuy.call(this, number);
        };
    }

}

window.clientGlobalManager.clientShopManager = new ClientShopManager();