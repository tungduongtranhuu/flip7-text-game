import { ask, closeInput } from "./utils.js";
import { Player } from "./player.js";
import { Game } from "./game.js";

async function main() {
    console.log("🎴 FLIP 7 - TEXT GAME");

    // Demander le nombre de joueurs et leurs noms
    const nbPlayers = parseInt(await ask("Nombre de joueur: "));
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
        console.log("\n=== Scores actuels ===");
        players.forEach((p) => console.log(`${p.name}: ${p.score} pts`));
    }

    console.log("\n--- Résultat ---");
    players.forEach((p) => {
        console.log(`${p.name}: ${p.score} points`);
    });

    closeInput();
}

main();
