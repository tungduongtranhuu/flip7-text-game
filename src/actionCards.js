export class ActionCard {
  constructor(type) {
    this.type = type;
  }

  applyEffect(player, game) {
    switch (this.type) {
      case "Freeze":
        console.log(`❄️ ${player.name} bị loại khỏi vòng và mất toàn bộ điểm!`);
        player.active = false;
        player.cards = [];
        break;
      case "Flip Three":
        console.log(`🔄 ${player.name} phải rút thêm 3 lá bài!`);
        for (let i = 0; i < 3; i++) {
          const card = game.deck.draw();
          player.addCard(card);
          console.log(`🃏 ${player.name} rút: ${card}`);
        }
        break;
      case "Second Chance":
        console.log(`✨ ${player.name} nhận được cơ hội thứ hai!`);
        if (!player.hasSecondChance) {
            console.log(`✨ ${player.name} garde une carte Second Chance pour ce tour.`);
            player.hasSecondChance = true;
        } else {
            const other = game.players.find(p => p.active && p !== player && !p.hasSecondChance);
            if (other) {
                console.log(`✨ ${player.name} donne une carte Second Chance à ${other.name}.`);
                other.hasSecondChance = true;
            } else {
                console.log(`🗑️ Seconde Chance défaussée (personne ne peut la recevoir)`);
            }
        }
        break;
      default:
        console.log("Lá bài hành động không hợp lệ.");
    }
  }
}