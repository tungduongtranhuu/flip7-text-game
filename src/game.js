import { Deck } from "./deck.js";
import { ask } from "./utils.js";
import { Logger } from "./logger.js";

export class Game {
  constructor(players) {
    this.players = players;
    this.deck = new Deck();
    this.logger = new Logger();
  }

  async startRound() {
    console.log("\n--- Commence par un nouveau tour ---");

    this.players.forEach(p => p.resetForRound());

    for (const player of this.players) {
      console.log(`\nTour de ${player.name}`);
      console.log(`Les cartes disponibles: ${this.deck.cards.length}`);

      let nbCarte;
      do {
        nbCarte = parseInt(await ask("Combien de cartes à tirer? (max: 7) "));
        if (nbCarte > 7) {
          console.log("❌ Vous ne pouvez pas tirer plus de 7 cartes. Veuillez réessayer.");
        }
      } while (nbCarte > 7);

      for (let i = 0; i < nbCarte; i++) {
        const card = this.deck.draw();
        if (player.hasDuplicate(card)) {
          player.active = false;
          player.cards = [];
          console.log(`💥 Même carte (${card}) ! Éliminé.`);
          this.logger.log({
            player: player.name,
            action: "duplicate",
            card
          });
          break; // Arrêter le tirage pour ce joueur
        } else {
          player.addCard(card);
          console.log(`🃏 Tiré: ${card}`);
          this.logger.log({
            player: player.name,
            action: "draw",
            card
          });
        }
      }

      // Vérifier si le joueur a tiré exactement 7 cartes différentes
      if (player.cards.length === 7 && new Set(player.cards).size === 7) {
        console.log(`🎉 ${player.name} a tiré 7 cartes différentes et gagne 15 points bonus !`);
        player.score += 15;
      }

      // Calculer les points cumulés après chaque tour
      if (player.active) {
        player.score += player.getRoundScore();
        console.log(`${player.name} a maintenant ${player.score} points.`);
      }

      // Vérifier si un joueur atteint 200 points
      if (player.score >= 200) {
        console.log(`\n🏆 ${player.name} gagne la partie avec ${player.score} points !`);
        return true; // Fin du jeu
      }
    }

    // Réinitialiser le paquet après chaque tour
    this.deck.reset();
    return false; // Le jeu continue
  }
}

