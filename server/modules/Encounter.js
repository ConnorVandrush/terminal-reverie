export default class Encounter {
  constructor(characters, enemies) {
    this.characters = characters;
    this.enemies = enemies;
    this.characterTurns = [];
  }

  isAbleToAct(actor) {
    return !actor.canAct;
  }
}
