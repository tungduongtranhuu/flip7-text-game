export class Deck {
  constructor() {
    this.cards = [];
    this.init();
    this.shuffle();
  }

  init() {
    for (let value = 0; value <= 12; value++) {
      for (let i = 0; i <= value; i++) {
        this.cards.push(value);
      }
    }
  }

  shuffle() {
    this.cards.sort(() => Math.random() - 0.5);
  }

  draw() {
    return this.cards.pop();
  }

  reset() {
    this.cards = [];
    this.init();
    this.shuffle();
  }
}
