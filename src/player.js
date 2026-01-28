import { ModifierCard } from "./modifierCards.js";
import { ActionCard } from "./actionCards.js";

export class Player {
  constructor(name) {
    this.name = name;
    this.cards = [];
    this.modifiers = [];
    this.active = true;
    this.score = 0;
    this.hasSecondChance = false; // Nouveau champ pour gérer Second Chance
    this.flip7 = false; // Nouveau champ pour gérer Flip 7
  }

  addCard(card) {
    if (card instanceof ModifierCard || card instanceof ActionCard) {
      console.log(`🃏 ${this.name} a reçu une carte spéciale: ${card.type}`);
    } else {
      this.cards.push(card);
      this.totalCards++; // Incrémenter le total des cartes accumulées
    }
  }
  addModifier(modifier) {
    this.modifiers.push(modifier);
  }

  hasDuplicate(card) {
    return this.cards.includes(card);
  }

  resetForRound() {
    this.cards = [];
    this.active = true;
    this.hasSecondChance = false; // Réinitialiser Second Chance à chaque tour
    this.flip7 = false; // Réinitialiser Flip 7 à chaque tour
    this.modifiers = [];
  }

  getRoundScore() {
    return this.cards.reduce((a, b) => a + b, 0);
  }
}
