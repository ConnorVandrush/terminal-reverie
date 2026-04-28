class ClientShopManager 
{
    constructor() 
    {
        this.socket = window.socket;

        const _doBuy = Scene_Shop.prototype.doBuy;
        Scene_Shop.prototype.doBuy = function(number) 
        {
            window.socket.emitWithAck("clientBuyItem", 
            {
                itemId: this._item.id,
                quantity: number
            }).then((response) => 
            {
                if (response.success) 
                {
                    //globalThis.playerData.characterStats.gold = response.buyerGold;
                    //globalThis.playerData.characterStats.inventory = response.buyerInventory;
                    //window.dispatchToReact?.({type: "inventory/setInventory", payload: response.buyerInventory});
                    //window.dispatchToReact?.({type: "stats/setGold", payload: response.buyerGold});
                }
            });
            _doBuy.call(this, number);
        };
    }

    syncGold()
    {
        const playerId = window.clientGlobalManager.clientPlayerManager.characterData.playerId
        const member = window.clientGlobalManager.clientPartyManager.partyData.members.find(m => m.playerId === playerId);

        if (!member) return;

        $gameParty._gold = member.gold;

        const scene = SceneManager._scene;
        if (scene && scene._goldWindow) 
        {
            scene._goldWindow.refresh();
        }
    }

    syncPossesions() {
        const playerId = window.clientGlobalManager.clientPlayerManager.characterData.playerId;
        const member = window.clientGlobalManager.clientPartyManager.partyData.members
            .find(m => m.playerId === playerId);

        if (!member) return;

        const inventory = member.inventory;

        // 1. Clear RMMZ inventory
        $gameParty._items = {};
        $gameParty._weapons = {};
        $gameParty._armors = {};

        // 2. Rebuild from MMO inventory
        for (const itemId in inventory) {
            const entry = inventory[itemId];
            const quantity = entry.quantity;

            if (quantity > 0) {
                const dataItem = $dataItems[Number(itemId)];
                if (dataItem) {
                    $gameParty.gainItem(dataItem, quantity);
                }
            }
        }

        // 3. Refresh shop windows if inside a shop
        const scene = SceneManager._scene;
        if (scene && scene._buyWindow) {
            scene._buyWindow.refresh();
        }
    }

}

window.clientGlobalManager.clientShopManager = new ClientShopManager();