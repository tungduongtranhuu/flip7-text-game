# JS-G25 - Flip 7

Ce project JS-G25 est un application dans le terminal utilisant Node.js permettant de jouer au jeu Flip 7.

## Pré-requis
- Node.js

## Installation
1. Cloner le dépôt GitHub :
```sh
git clone https://github.com/tungduongtranhuu/JS-G25.git
```

2. Puis accédez au répertoire du projet :
```sh
cd JS-G25
```

## Lancement
Lancer l'application à l'aide de Node.js :
```sh
node src/index.js
```

## Structure du projet
```
JS-G25
├── package.json
├── README.md
└── src
    ├── actionCards.js      # Définit les cartes d'action
    ├── deck.js             # Gestion du paquet de cartes
    ├── game.js             # Logique principale du jeu
    ├── index.js            # Point d'entrée de l'application
    ├── logger.js           # Gestion des logs
    ├── logs
    │   └── game-log.json   # Fichier de log des parties
    ├── modifierCards.js
    ├── player.js           # Définit la classe Player (État joueur)
    └── utils.js            # Fonctions utilitaires
```

## Règles du jeu
