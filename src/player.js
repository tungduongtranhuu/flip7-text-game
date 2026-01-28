export class Player {
  constructor(name) {
    this.name = name;
    this.cards = [];
    this.active = true;
    this.score = 0;
    this.totalCards = 0; // Nouveau champ pour suivre les cartes accumulées
  }

  addCard(card) {
    this.cards.push(card);
    this.totalCards++; // Incrémenter le total des cartes accumulées
  }

  hasDuplicate(card) {
    return this.cards.includes(card);
  }

  resetForRound() {
    this.cards = [];
    this.active = true;
  }

  getRoundScore() {
    return this.cards.reduce((a, b) => a + b, 0);
  }
}
