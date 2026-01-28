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

    this.players.forEach(p => p.resetForRound());

    // Chia bài ban đầu
    for (const player of this.players) {
      const card = this.deck.draw();
      if (card instanceof ModifierCard) {
        console.log(`🃏 ${player.name} a reçu une carte spéciale: ${card.type} ${card.value}`);
        player.addModifier(card); // Thêm lá bài Modifier vào tay người chơi
      } else if (card instanceof ActionCard) {
        console.log(`🃏 ${player.name} a reçu une carte spéciale: ${card.type}`);
        card.applyEffect(player, this); // Kích hoạt hiệu ứng của lá bài Action
      } else {
        console.log(`🃏 ${player.name} nhận được: ${card}`);
        player.addCard(card);
      }
    }

    // Xử lý lượt chơi
    for (const player of this.players) {
      if (!player.active) continue; // Bỏ qua người chơi bị loại

      console.log(`\nTour de ${player.name}`);
      console.log(`Les cartes disponibles: ${this.deck.cards.length}`);

      const action = parseInt(await ask("Voulez-vous (1) tirer des cartes ou (2) passer ce tour? "));

      if (action === 2) {
        console.log(`${player.name} a choisi de passer ce tour.`);
        continue; // Bỏ qua lượt chơi của người chơi này
      }

      const nbCarte = parseInt(await ask("Combien de cartes à tirer? (max: 7) "));
      for (let i = 0; i < nbCarte; i++) {
        const card = this.deck.draw();
        if (card instanceof ActionCard) {
          card.applyEffect(player, this);
        } else if (card instanceof ModifierCard) {
          console.log(`✨ ${player.name} a reçu une carte Modifier: ${card.type} ${card.value}`);
          player.addModifier(card);
        } else {
          if (player.hasDuplicate(card)) {
            if (player.hasSecondChance) {
              console.log(`🔄 ${player.name} utilise Second Chance pour éviter l'élimination!`);
              player.hasSecondChance = false; 
              continue;
            }
            else {
            player.active = false;
            player.cards = [];
            console.log(`💥 Même carte (${card}) ! Éliminé.`);
            this.logger.log({
              player: player.name,
              action: "duplicate",
              card
            });
            break; // Arrêter le tirage pour ce joueur
            }
          } else {
            player.addCard(card);
            console.log(`🃏 Tiré: ${card}`);
            //FLIP 7 CHECK
            if (player.cards.length === 7) {
              console.log(`🎉 ${player.name} a atteint 7 cartes sans doublons! Bonus de 15 points!`);
              player.flip7=true
            }
            this.logger.log({
              player: player.name,
              action: "draw",
              card
            });
          }
        }
      }

      // Tính điểm cuối vòng
      if (player.active) {
        let score = player.getRoundScore();

        // 1️⃣ Áp dụng x2 trước
        player.modifiers
        .filter(m => m.type === "x")
        .forEach(m => {
        score *= m.value;
        });


        // 2️⃣ Cộng điểm +
        player.modifiers
        .filter(m => m.type === "+")
        .forEach(m => {
        score += m.value;
        });


        // (3️⃣ Flip 7 )
        if (player.flip7) {
          score += 15;
        }
        player.score += score;
        console.log(`${player.name} a maintenant ${player.score} points.`);
        }

      // Kiểm tra người thắng
      if (player.score >= 200) {
        console.log(`\n🏆 ${player.name} gagne la partie avec ${player.score} points !`);
        return true; // Fin du jeu
      }
    }
    this.players.forEach(p => {
      p.hasSecondChance = false; // Réinitialiser Second Chance à la fin du tour
    });

    // Trộn lại bộ bài nếu hết bài
    if (this.deck.cards.length === 0) {
      console.log(" La pioche est vide, on mélange les cartes défaussées.");
      this.deck.cards = [...this.deck.playedCards];
      this.deck.playedCards = [];
      this.deck.shuffle();
    }
    // Chuyển dealer sang người bên trái
    const firstPlayer = this.players.shift();
    this.players.push(firstPlayer);

    return false; // Le jeu continue
  }
}

