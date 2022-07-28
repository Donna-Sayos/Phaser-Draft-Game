import DesertScene from "./scenes/DesertScene.js";

const config = {
    type: Phaser.AUTO,
    scale: {
        parent: 'game-container',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        zoom: 1.5
    },
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 }, 
            debug: true,
        },
    },
    scene: [ DesertScene ]
};

const game = new Phaser.Game(config);