import items from "../data/Items.json" with { type: "json" };

export default class ServerInventoryManager {
  constructor(serverAPI) {
    this.serverAPI = serverAPI;
    this.items = new Map();

    for (const [id, item] of Object.entries(items)) {
      if (id === "tags") continue;
      this.items.set(Number(id), item);
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
      characterData,
    };
  }

  startListeners() {
    this.serverAPI.serverManager.authNamespace.on("connection", (socket) => {
      socket.on("clientUseSelectedItem", (payload) => {
        this.equipItem(socket.characterId, payload);

        const characterData = this.serverAPI.playerManager.charactersOnline.get(
          socket.characterId,
        );

        this.serverAPI.serverManager.authNamespace
          .to(characterData.partyRoom)
          .emit(
            "serverSyncPartyData",
            this.serverAPI.playerManager.getPartyMemberData(
              characterData.partyMemberIds,
            ),
          );
      });
    });
  }
}
