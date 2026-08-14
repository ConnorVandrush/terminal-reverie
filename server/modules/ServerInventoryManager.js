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

  getEquipmentData(equipmentId) {
    const itemData = this.items.get(equipmentId);

    if (!itemData) return null;

    return {
      id: equipmentId,
      ...itemData,
    };
  }
}
