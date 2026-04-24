const fs = require('fs');
const path = require('path');

class ServerInventoryManager
{
    constructor()
    {
        this.items = new Map()
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

    startListeners()
    {
    }
}

module.exports = ServerInventoryManager