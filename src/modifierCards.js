export class ModifierCard {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }

  applyModifier(score) {
    if (this.type === "add") {
      return score + this.value;
    } else if (this.type === "multiply") {
      return score * this.value;
    }
    return score;
  }
}