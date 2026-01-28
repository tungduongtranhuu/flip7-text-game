import { ActionCard } from "./actionCards.js";
import { ModifierCard } from "./modifierCards.js";

export class Deck {
  constructor() {
    this.cards = [];
    this.playedCards = [];
    this.init();
    this.shuffle();
  }

  init() {
    // Ajouter les cartes numériques
    for (let value = 0; value <= 12; value++) {
      for (let i = 0; i <= value; i++) {
        this.cards.push(value);
      }
    }

    // Ajouter les cartes Action
    this.cards.push(new ActionCard("Freeze"));
    this.cards.push(new ActionCard("Flip Three"));
    this.cards.push(new ActionCard("Second Chance"));

    // Ajouter les cartes Modifier
    this.cards.push(new ModifierCard("+",2));
    this.cards.push(new ModifierCard("+",4));
    this.cards.push(new ModifierCard("+",6));
    this.cards.push(new ModifierCard("+",8));
    this.cards.push(new ModifierCard("+",10));
    this.cards.push(new ModifierCard("x",2));
  }

  shuffle() {
    this.cards.sort(() => Math.random() - 0.5);
  }

  draw() {
    const card = this.cards.pop();
    this.playedCards.push(card);
    return card;
  }

  reset() {
    this.cards = [...this.cards, ...this.playedCards];
    this.playedCards = [];
    this.shuffle();
  }
}
