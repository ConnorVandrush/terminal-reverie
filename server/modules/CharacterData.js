export default class CharacterData {
  constructor() {
    this.characterId = null;
    this.socketId = null;
    this.isDead = false;
    this.isDefending = false;
    this.location = { x: 0, y: 0, d: 0, map: "" };
    this.name = "";
    this.freeSteps = 0;
    this.level = 1;
    this.experience = 0;
    this.gold = 0;
    this.maxHp = 100;
    this.currentHp = 100;
    this.inventory = {}; //{ "itemId": { "qty":, "itemInfo": } }
    this.equipment = {
      weapon: "37",
      armor: "38",
      accessory: "39",
      item1: "40",
      item2: "40",
      item3: "40",
    };
    this.appearance = {
      skin: {
        type: null,
        palette: null,
      },
      eyes: {
        type: null,
        palette: null,
      },
      clothing: {
        type: null,
        palette: null,
      },
      hair: {
        type: null,
        palette: null,
      },
      armor: {
        type: null,
        palette: null,
      },
      accessory: {
        type: null,
        palette: null,
      },
      weapon: {
        type: null,
        palette: null,
      },
    };
    this.attacks = ["Strike"];
    this.defends = ["Flee"];
    this.magics = ["Focus"];
    this.items = ["Equip"];
    this.tradeOffer = null;
    this.canMove = true;
    this.canTransfer = true;
    this.partyRoom = null;
    this.partyMemberIds = [];
    this.sentPartyInvitations = [];
    this.canAct = true;
  }

  Strike(target) {
    if (target.isDead) {
      return {
        combatantId: this.enemyInstanceId ?? this.characterId,
        targetId: target.enemyInstanceId ?? target.characterId,
        action: "Strike",
        message: `${this.name} missed ${target.name}.`,
      };
    }
    const damage = this.equipment.weapon.baseDamage;
    target.currentHp -= damage;
    return {
      combatantId: this.enemyInstanceId ?? this.characterId,
      targetId: target.enemyInstanceId ?? target.characterId,
      action: "Strike",
      damage: damage,
      message: `${target.name} took ${damage} damage.`,
    };
  }
}
