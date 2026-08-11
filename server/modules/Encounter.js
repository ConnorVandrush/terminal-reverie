export default class Encounter {
  constructor(characters, enemies) {
    this.characters = characters;
    this.enemies = enemies;
  }

  isAbleToAct(actor) {
    return !actor.canAct;
  }
}
