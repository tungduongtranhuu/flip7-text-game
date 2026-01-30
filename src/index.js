import { ask, closeInput } from "./utils.js";
import { Player } from "./player.js";
import { Game } from "./game.js";

async function main() {
    console.log("🎴 FLIP 7 - TEXT GAME");

    // Demander le nombre de joueurs et leurs noms
    let nbPlayers;
    do {
        nbPlayers = parseInt(await ask("Nombre de joueur: "));
        if (isNaN(nbPlayers) || nbPlayers <= 1) {
            console.log(
                "Veuillez entrer un nombre valide de joueurs (au moins 2).",
            );
        }
    } while (isNaN(nbPlayers) || nbPlayers <= 1);

    const players = [];

    for (let i = 0; i < nbPlayers; i++) {
        const name = await ask(`Nom du joueur ${i + 1}: `);
        players.push(new Player(name));
    }

    // Boucle de jeu principale
    const game = new Game(players);
    let gameWon = false;
    while (!gameWon) {
        gameWon = await game.startRound();
        if (!gameWon){
          console.log("\n=== Scores actuels ===");
          players.forEach((p) => console.log(`${p.name}: ${p.score} pts`));
        }
        }
    closeInput();
}

main();
