export class ModifierCard {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }

  applyModifier(score) {
    if (this.type === "+") {
      return score + this.value;
    } else if (this.type === "*") {
      return score * this.value;
    }
    return score;
  }
}
