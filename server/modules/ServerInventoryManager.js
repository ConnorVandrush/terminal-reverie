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
                    playerData.isBusy = true;
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
                playerData.isBusy = false;
                cb({ success: true });
            });

            socket.on('clientSendTradeRequest', async ({ toPlayerName }, cb) =>
            {
                const toPlayer = this.serverPlayerManager.playersOnline.get(this.serverPlayerManager.characterNameToId.get(toPlayerName));
                const toPlayerSocket = toPlayer ? toPlayer.socketId : null;
                const fromPlayerName = this.serverPlayerManager.playersOnline.get(socket.playerId)?.characterData.name || "Unknown";
                if (!toPlayerSocket) 
                {
                    return cb({ success: false, message: `Player ${toPlayerName} not found` });
                }
                if (toPlayerSocket.id === socket.id)
                {
                    return cb({ success: false, message: `You cannot send a trade request to yourself` });
                }
                cb({ success: true, message: `Trade request sent to ${toPlayerName}` });
                this.io.to(toPlayerSocket).emit('serverSendTradeRequest', { fromPlayerName });
            });

            socket.on('clientAcceptTradeRequest', async ({ fromPlayerName }, cb) =>
            {
                if (this.serverPartyManager.checkOrthogonalAdjacency(socket.playerId, this.serverPlayerManager.characterNameToId.get(fromPlayerName)))
                {
                    const fromPlayer = this.serverPlayerManager.playersOnline.get(this.serverPlayerManager.characterNameToId.get(fromPlayerName));
                    fromPlayer.partyData.partyLeaderId = fromPlayer.characterData.playerId;
                    const fromPlayerSocket = fromPlayer ? fromPlayer.socketId : null;
                    const toPlayer = this.serverPlayerManager.playersOnline.get(socket.playerId);
                    toPlayer.partyData.partyLeaderId = fromPlayer.characterData.playerId;
                    if (!fromPlayerSocket) 
                    {
                        return cb({ success: false, message: `Player ${fromPlayerName} not found` });
                    }
                    if (fromPlayerSocket.id === socket.id)
                    {
                        return cb({ success: false, message: `You cannot accept an invite from yourself` });
                    }
                    if (toPlayer.isBusy || fromPlayer.isBusy)                    
                    {
                        return cb({ success: false, message: `${fromPlayerName} is currently busy` });
                    }
                    toPlayer.isBusy = true;
                    fromPlayer.isBusy = true;
                    this.io.to(fromPlayerSocket).emit('serverTradeRequestAccepted', { fromPlayerName: toPlayer.characterData.name });
                    cb({ success: true, fromPlayerName: fromPlayerName, message: `Trade request accepted. Starting trade with ${fromPlayerName}` });
                }
                else
                {
                    cb({ success: false, message: `You must be adjacent to ${fromPlayerName} to accept the party invite` });
                }
            });

            socket.on('clientTradeDeclined', async ({ tradePartner }, cb) =>
            {
                const playerData = this.serverPlayerManager.playersOnline.get(socket.playerId);
                const partnerPlayerData = this.serverPlayerManager.playersOnline.get(this.serverPlayerManager.characterNameToId.get(tradePartner));
                const partnerSocket = partnerPlayerData ? partnerPlayerData.socketId : null;
                if (partnerSocket)                
                {
                    this.io.to(partnerSocket).emit('serverTradeDeclined', { fromPlayerName: playerData.characterData.name });
                }
                partnerPlayerData.isBusy = false;
                playerData.isBusy = false;
                cb({ success: true });
            });

            socket.on('clientOfferGoldInTrade', async ({ amt, tradePartner }, cb) =>
            {
                const playerData = this.serverPlayerManager.playersOnline.get(socket.playerId);
                const partnerPlayerData = this.serverPlayerManager.playersOnline.get(this.serverPlayerManager.characterNameToId.get(tradePartner));
                const partnerSocket = partnerPlayerData ? partnerPlayerData.socketId : null;
                if (amt < 0)
                {
                    return cb({ success: false, message: "Amount must be positive" });
                }
                if (amt > playerData.characterData.gold)
                {
                    return cb({ success: false, message: "You do not have that much gold" });
                }
                playerData.characterData.gold -= amt;
                if (partnerSocket)                
                {
                    this.io.to(partnerSocket).emit('serverUpdateTheirOfferGold', { amt: amt, fromPlayerName: playerData.characterData.name });
                }
                cb({ success: true });
            });

            socket.on('clientOfferItemInTrade', async ({ qty, item, tradePartner }, cb) =>
            {
                const itemId = item.id;
                const playerData = this.serverPlayerManager.playersOnline.get(socket.playerId);
                const playerInventory = playerData.characterData.inventory;

                const partnerPlayerData = this.serverPlayerManager.playersOnline.get(
                    this.serverPlayerManager.characterNameToId.get(tradePartner)
                );
                const partnerInventory = partnerPlayerData.characterData.inventory;
                const partnerSocket = partnerPlayerData ? partnerPlayerData.socketId : null;

                // Validate qty
                if (qty < 0) {
                    return cb({ success: false, message: "Amount must be positive" });
                }

                // Offering player must own the item
                const invItem = playerInventory[itemId];
                if (!invItem) {
                    return cb({ success: false, message: "You do not have that item" });
                }

                // Offering player must have enough quantity
                if (invItem.quantity < qty) {
                    return cb({ success: false, message: "You do not have enough of that item" });
                }

                // Receiving player must not exceed 99
                const partnerInvItem = partnerInventory[itemId];
                const partnerCurrentQty = partnerInvItem ? partnerInvItem.quantity : 0;

                if (partnerCurrentQty + qty > 99) {
                    return cb({ success: false, message: "They cannot hold more than 99 of that item" });
                }

                // Notify partner
                if (partnerSocket) {
                    this.io.to(partnerSocket).emit('serverUpdateTheirOfferItems', {
                        qty,
                        item,
                        fromPlayerName: playerData.characterData.name
                    });
                }

                cb({ success: true });
            });

            socket.on('clientTradeAccepted', async ({ tradePartner, theirOfferGold, theirOfferItems, yourOfferGold, yourOfferItems }, cb) =>
            {
                console.log(tradePartner, theirOfferGold, theirOfferItems, yourOfferGold, yourOfferItems);
            });
        });
    }
}

module.exports = ServerInventoryManager