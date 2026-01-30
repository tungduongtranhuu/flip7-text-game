import { Deck } from "./deck.js";
import { ask } from "./utils.js";
import { Logger } from "./logger.js";
import { ActionCard } from "./actionCards.js";
import { ModifierCard } from "./modifierCards.js";

export class Game {
    constructor(players) {
        this.players = players;
        this.deck = new Deck();
        this.logger = new Logger();
    }

    async startRound() {
        console.log("\n--- Commence par un nouveau tour ---");

        this.players.forEach((p) => p.resetForRound());

    // Distribution initiale des cartes
    for (const player of this.players) {
      const card = this.deck.draw();
      if (card === null) {
        console.log("⚠️ Plus de cartes disponibles pour la distribution.");
        break;
      }
      else {
        if (card instanceof ModifierCard) {
          console.log(`🃏 ${player.name} a reçu une carte spéciale: ${card.type} ${card.value}`);
          player.addModifier(card); // Ajouter une carte Modifier au joueur
        } else if (card instanceof ActionCard) {
          console.log(`🃏 ${player.name} a reçu une carte spéciale: ${card.type}`);
          card.applyEffect(player, this); //Appliquer l'effet de la carte Action
        } else {
          console.log(`🃏 ${player.name} a reçu: ${card}`);
          player.addCard(card);
        }
      }
    }
      
        // Gestion des tours des joueurs
        for (const player of this.players) {
            if (!player.active) continue; // Ignorer les joueurs inactifs

            console.log(`\nTour de ${player.name}`);
            console.log(`Les cartes disponibles: ${this.deck.cards.length}`);

            let action;
            do {
                action = parseInt(
                    await ask(
                        "Voulez-vous (1) tirer des cartes ou (2) passer ce tour? ",
                    ),
                );
                if (isNaN(action) || (action !== 1 && action !== 2)) {
                    console.log("Veuillez entrer 1 ou 2.");
                }
            } while (isNaN(action) || (action !== 1 && action !== 2));

            if (action === 2) {
                console.log(`${player.name} a choisi de passer ce tour.`);
                continue; // Passer le tour de ce joueur
            }

            // Demande au joueur combien de cartes il veut tirer
            // Demande jusqu'à obtenir un nombre valide entre 1 et 7
            let nbCarte;
            do {
                nbCarte = parseInt(
                    await ask("Combien de cartes à tirer? (1-7) "),
                );
                if (isNaN(nbCarte) || nbCarte < 1 || nbCarte > 7) {
                    console.log(
                        "Veuillez entrer un nombre valide entre 1 et 7.",
                    );
                }
            } while (isNaN(nbCarte) || nbCarte < 1 || nbCarte > 7);

            for (let i = 0; i < nbCarte; i++) {
                const card = this.deck.draw();
                if (card instanceof ActionCard) {
                    card.applyEffect(player, this);
                } else if (card instanceof ModifierCard) {
                    console.log(
                        `✨ ${player.name} a reçu une carte Modifier: ${card.type} ${card.value}`,
                    );
                    player.addModifier(card);
                } else {
                    if (player.hasDuplicate(card)) {
                        if (player.hasSecondChance) {
                            console.log(
                                `🔄 ${player.name} utilise Second Chance pour éviter l'élimination!`,
                            );
                            player.hasSecondChance = false;
                            continue;
                        } else {
                            player.active = false;
                            player.cards = [];
                            console.log(`💥 Même carte (${card}) ! Éliminé.`);
                            this.logger.log({
                                player: player.name,
                                action: "duplicate",
                                card,
                            });
                            break; // Arrêter le tirage pour ce joueur
                        }
                    } else {
                        player.addCard(card);
                        console.log(`🃏 Tiré: ${card}`);
                        //FLIP 7 CHECK
                        if (player.cards.length === 7) {
                            console.log(
                                `🎉 ${player.name} a atteint 7 cartes sans doublons! Bonus de 15 points!`,
                            );
                            player.flip7 = true;
                        }
                        this.logger.log({
                            player: player.name,
                            action: "draw",
                            card,
                        });
                    }
                }
            }

            // Calcul des scores de fin de tour
            if (player.active) {
                let score = player.getRoundScore();

                // 1️⃣ Appliquer les multiplicateurs x en premier
                player.modifiers
                    .filter((m) => m.type === "x")
                    .forEach((m) => {
                        score *= m.value;
                    });

                // 2️⃣ Appliquer les additions +
                player.modifiers
                    .filter((m) => m.type === "+")
                    .forEach((m) => {
                        score += m.value;
                    });

                // (3️⃣ Bonnus Flip 7 )
                if (player.flip7) {
                    score += 15;
                }
                player.score += score;
                console.log(
                    `${player.name} a maintenant ${player.score} points.`,
                );
            }

            // Vérification de la victoire
            if (player.score >= 200) {
                console.log(
                    `\n🏆 ${player.name} gagne la partie avec ${player.score} points !`,
                );
                return true; // Fin du jeu
            }
        }
        // Réinitialiser Second Chance à la fin du tour
        this.players.forEach((p) => {
            p.hasSecondChance = false;
        });

        // Mélanger le deck si vide
        if (this.deck.cards.length === 0) {
            console.log(
                " La pioche est vide, on mélange les cartes défaussées.",
            );
            this.deck.cards = [...this.deck.playedCards];
            this.deck.playedCards = [];
            this.deck.shuffle();
        }
        // Passer le role dealer à personne à gauche
        const firstPlayer = this.players.shift();
        this.players.push(firstPlayer);

        return false; // Le jeu continue
    }
    // Réinitialiser Second Chance à la fin du tour
    this.players.forEach(p => {
      p.hasSecondChance = false; 
    });


    // Passer le role dealer à personne à gauche
    const firstPlayer = this.players.shift();
    this.players.push(firstPlayer);

    return false; // Le jeu continue
  }
}
