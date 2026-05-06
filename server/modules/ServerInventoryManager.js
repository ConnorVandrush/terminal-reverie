const fs = require('fs');
const path = require('path');

class ServerInventoryManager
{
    constructor(io, serverPlayerManager, serverPartyManager, serverMapManager)
    {
        this.io = io;
        this.serverPlayerManager = serverPlayerManager;
        this.serverPartyManager = serverPartyManager;
        this.serverMapManager = serverMapManager
        this.items = new Map();
        this.shops = new Map(); // Map<shopName, Map<itemId, itemData>>
    }

    loadItems()
    {
        const filePath = path.join(__dirname, '../data/Items.json');
        const raw = fs.readFileSync(filePath, 'utf8');
        const json = JSON.parse(raw);

        for (const [id, item] of Object.entries(json)) 
        {
            const numericId = Number(id);
            this.items.set(numericId, item);
        }
    }

    loadShops() 
    {
        const filePath = path.join(__dirname, '../data/Shops.json');
        const raw = fs.readFileSync(filePath, 'utf8');
        const json = JSON.parse(raw);

        for (const [shopName, itemsObj] of Object.entries(json)) {
            const itemMap = new Map();

            for (const [itemId, itemData] of Object.entries(itemsObj)) {
                itemMap.set(Number(itemId), itemData);
            }

            this.shops.set(shopName, itemMap);
        }
    }

    addItemToInventory(inventory, itemId, amount)
    {
        const key = String(itemId);

        if (inventory[key]) 
        {
            inventory[key].quantity += amount;
            return;
        }

        const baseItem = this.items.get(itemId);
        inventory[key] = 
        {
            id: itemId,
            name: baseItem.name,
            description: baseItem.description,
            effects: baseItem.effects,
            quantity: amount
        };
    }

    clientUseItem(playerData, itemId, targetMemberId, partyData) 
    {
        const characterData = playerData.characterData
        const inventory = characterData.inventory;
        const key = String(itemId);
        let itemUsed = false;

        // 1. Validate inventory
        if (!inventory[key] || inventory[key].quantity <= 0) {
            return { success: false, error: "Item not in inventory" };
        }

        // 2. Validate item definition
        const itemDef = this.items.get(itemId);
        if (!itemDef) 
        {
            return { success: false, error: "Invalid item ID" };
        }

        // 3. Determine target (self or party member)
        let target = characterData;
        if (partyData) 
        {
            target = partyData.members.get(targetMemberId);
            if (!target) 
            {
                return { success: false, error: "Invalid party member" };
            }
        }

        // 4. Apply effects
        if (itemDef.effects.restoreHP && target.currentHp < target.maxHp) {
            const percent = itemDef.effects.restoreHP; // e.g. 25
            const maxHp = target.maxHp;

            const amount = Math.floor(maxHp * (percent / 100));

            target.currentHp = Math.min(
                maxHp,
                target.currentHp + amount
            );

            itemUsed = true;
        }

        // 5. Remove item from inventory
        if (itemUsed)
        {
            inventory[key].quantity -= 1;
            if (inventory[key].quantity <= 0) {
                delete inventory[key];
            }
        }

        // 6. Return updated data
        return {
            success: true,
            itemUsed: itemDef,
            targetId: targetMemberId,
            updatedInventory: inventory,
            updatedTarget: target
        };
    }

    buildShopInventory(shopData) 
    {
        const result = {};

        for (const [itemId, priceInfo] of shopData.entries()) {
            const itemInfo = this.items.get(itemId);

            if (!itemInfo) continue;

            result[itemId] = {
                ...itemInfo,
                cost: priceInfo.cost
            };
        }

        return result;
    }

    clientBuyItem(playerData, itemId, quantity)
    {
        const characterData = playerData.characterData
        const inventory = characterData.inventory;
        const key = String(itemId);
        const eventData = this.serverMapManager.getEventData(characterData.location.map, characterData.location.x, characterData.location.y)
        const shopData = this.shops.get(eventData.note);
        const baseCost = shopData.get(parseInt(itemId)).cost;
        const totalCost = baseCost * quantity;

        if (inventory[key].quantity + quantity > 99) 
        {
            return { success: false, message: "Not enough space." };
        }
        else if (totalCost > characterData.gold) 
        {
            return { success: false, message: "Not enough gold." };
        }
        else
        {
            characterData.gold -= totalCost;
            this.addItemToInventory(inventory, itemId, quantity);
            return { success: true, characterData: characterData };
        }
    }

    startListeners()
    {
        this.io.on('connection', (socket) =>
        {
            socket.on('clientUseItem', ({ selectedItem, selectedPartyMemberId }, cb) =>
            {
                const playerData = this.serverPlayerManager.playersOnline.get(socket.playerId);
                const partyData = this.serverPartyManager.playerParties.get(playerData.partyData.partyLeaderId);
                const result = this.clientUseItem(playerData, selectedItem.id, selectedPartyMemberId, partyData);
                if (partyData)
                {
                    this.io.to('party_${playerData.partyData.partyLeaderId}').emit("serverPartyStatusUpdate", { partyData });
                }
                cb(result);
            });

            socket.on('clientBuyItem', ({ itemId, quantity }, cb) =>
            {
                const playerData = this.serverPlayerManager.playersOnline.get(socket.playerId);
                const result = this.clientBuyItem(playerData, itemId, quantity);
                cb(result);
            });

            socket.on('clientRequestOpenShop', (cb) =>
            {
                const playerData = this.serverPlayerManager.playersOnline.get(socket.playerId);
                playerData.preventMovement = true;
                const location = playerData.characterData.location
                const eventData = this.serverMapManager.getEventData(location.map, location.x, location.y);
                const shopName = eventData.note;
                if (this.shops.has(shopName))
                {
                    const shopInventory = this.buildShopInventory(this.shops.get(shopName));
                    cb({ success: true, shopInventory: shopInventory });
                }
                else
                {
                    cb({ success: false, error: "Not a shop." });
                }
            });

            socket.on('clientRequestCloseShop', (cb) =>
            {
                const playerData = this.serverPlayerManager.playersOnline.get(socket.playerId);
                playerData.preventMovement = false;
                cb({ success: true });
            });
        });
    }
}

module.exports = ServerInventoryManager