import items from "../data/Items.json" with { type: "json" };
import shops from "../data/Shops.json" with { type: "json" };

export default class ServerInventoryManager {
  constructor(serverAPI) {
    this.serverAPI = serverAPI;
    this.items = new Map(); // itemId > itemData
    this.shops = new Map(); // shopName > { "itemId": {"cost": cost,}, }

    for (const [id, item] of Object.entries(items)) {
      if (id === "tags") continue;
      this.items.set(Number(id), item);
    }
    for (const [shopName, shopItems] of Object.entries(shops)) {
      this.shops.set(shopName, shopItems);
    }
  }

  getItemData(itemId) {
    const itemData = this.items.get(itemId);
    if (!itemData) return null;
    return itemData;
  }

  addItemToInventory(characterId, itemId, amount = 1) {
    // 1. Fetch characterData directly
    const characterData =
      this.serverAPI.playerManager.charactersOnline.get(characterId);

    if (!characterData) {
      return { success: false, error: "Character data not found" };
    }

    // 2. Ensure inventory exists
    if (!characterData.inventory) {
      characterData.inventory = {};
    }

    const inventory = characterData.inventory;
    const key = String(itemId);

    // 3. Get item definition
    const itemData = this.getItemData(itemId);
    if (!itemData) {
      return { success: false, error: "Invalid itemId" };
    }

    // 4. Add or increment quantity
    if (inventory[key]) {
      inventory[key].qty += amount;
    } else {
      inventory[key] = {
        qty: amount,
        itemData,
      };
    }
  }

  equipItem(characterId, itemId) {
    const characterData =
      this.serverAPI.playerManager.charactersOnline.get(characterId);

    if (!characterData) {
      return {
        success: false,
        error: "Character data not found",
      };
    }

    const key = String(itemId);
    const inventoryEntry = characterData.inventory?.[key];

    if (!inventoryEntry) {
      return {
        success: false,
        error: "Item not found in inventory",
      };
    }

    const itemData = inventoryEntry.itemData;
    const tags = itemData.tags || [];

    let slot = null;

    // Weapon
    if (tags.includes("weaponTag")) {
      slot = "weapon";
    }

    // Armor
    else if (tags.includes("armorTag")) {
      slot = "armor";
    }

    // Accessory
    else if (tags.includes("accessoryTag")) {
      slot = "accessory";
    }

    // Consumable / item
    else if (tags.includes("itemTag")) {
      const itemSlots = ["item1", "item2", "item3"];

      slot = itemSlots.find((slot) => characterData.equipment[slot]?.id === 40);

      if (!slot) {
        return {
          success: false,
          error: "No item slots are available",
        };
      }
    } else {
      return {
        success: false,
        error: "Item cannot be equipped",
      };
    }

    // Check fixed equipment slots
    if (slot === "weapon" && characterData.equipment.weapon?.id !== 37) {
      return {
        success: false,
        error: "Equipment slot is not empty",
      };
    }

    if (slot === "armor" && characterData.equipment.armor?.id !== 38) {
      return {
        success: false,
        error: "Equipment slot is not empty",
      };
    }

    if (slot === "accessory" && characterData.equipment.accessory?.id !== 39) {
      return {
        success: false,
        error: "Equipment slot is not empty",
      };
    }

    // Equip
    characterData.equipment[slot] = itemData;

    // Remove one from inventory
    inventoryEntry.qty -= 1;

    if (inventoryEntry.qty <= 0) {
      delete characterData.inventory[key];
    }

    return {
      success: true,
    };
  }

  unequipItem(characterId, slot) {
    const characterData =
      this.serverAPI.playerManager.charactersOnline.get(characterId);

    if (!characterData) {
      return {
        success: false,
        error: "Character data not found",
      };
    }

    const validSlots = [
      "weapon",
      "armor",
      "accessory",
      "item1",
      "item2",
      "item3",
    ];

    if (!validSlots.includes(slot)) {
      return {
        success: false,
        error: "Invalid equipment slot",
      };
    }

    const equippedItem = characterData.equipment?.[slot];

    if (!equippedItem) {
      return {
        success: false,
        error: "Nothing is equipped in that slot",
      };
    }

    // Empty/default equipment IDs.
    const emptyEquipmentIds = {
      weapon: 37,
      armor: 38,
      accessory: 39,
      item1: 40,
      item2: 40,
      item3: 40,
    };

    // If the slot already contains the empty/default item,
    // there is nothing to unequip.
    if (typeof equippedItem === "string" || typeof equippedItem === "number") {
      return {
        success: false,
        error: "Nothing is equipped in that slot",
      };
    }

    const itemId = equippedItem.id;

    if (itemId == null) {
      return {
        success: false,
        error: "Equipped item has no item ID",
      };
    }

    // Make sure inventory exists.
    if (!characterData.inventory) {
      characterData.inventory = {};
    }

    const inventoryKey = String(itemId);
    const inventoryEntry = characterData.inventory[inventoryKey];

    // Return the equipped item to inventory.
    if (inventoryEntry) {
      inventoryEntry.qty += 1;
    } else {
      characterData.inventory[inventoryKey] = {
        qty: 1,
        itemData: equippedItem,
      };
    }

    // Restore the empty equipment item.
    const emptyItemId = emptyEquipmentIds[slot];
    const emptyItemData = this.getItemData(emptyItemId);

    if (!emptyItemData) {
      return {
        success: false,
        error: `Missing empty equipment item ${emptyItemId}`,
      };
    }

    characterData.equipment[slot] = emptyItemData;

    return {
      success: true,
    };
  }

  buildShopInventory(shopData) {
    const result = {};

    for (const [itemId, priceInfo] of Object.entries(shopData)) {
      const itemInfo = this.items.get(Number(itemId));

      if (!itemInfo) continue;

      result[itemId] = {
        ...itemInfo,
        cost: priceInfo.cost,
      };
    }

    return result;
  }

  startListeners() {
    this.serverAPI.serverManager.authNamespace.on("connection", (socket) => {
      socket.on("clientUseSelectedItem", (payload) => {
        const result = this.equipItem(socket.characterId, payload);
        if (!result.success) {
          return;
        }
        this.serverAPI.playerManager.serverSyncPartyData(socket.characterId);
      });

      socket.on("clientUnequipItem", (payload) => {
        const result = this.unequipItem(socket.characterId, payload);
        if (!result.success) {
          return;
        }
        this.serverAPI.playerManager.serverSyncPartyData(socket.characterId);
      });

      socket.on("clientRequestOpenShop", (cb) => {
        const characterData = this.serverAPI.playerManager.charactersOnline.get(
          socket.characterId,
        );
        characterData.canMove = false;
        const location = characterData.location;
        const shopName = this.serverAPI.mapManager.getEventData(
          location.map,
          location.x,
          location.y,
        ).note;
        if (this.shops.has(shopName)) {
          const shopInventory = this.buildShopInventory(
            this.shops.get(shopName),
          );
          cb({ success: true, shopInventory });
        } else {
          cb({ success: false, message: "Failed to open shop." });
        }
      });
    });
  }
}
