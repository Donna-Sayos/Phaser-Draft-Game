import DesertScene from "./scenes/DesertScene.js";
import LoadScene from "./scenes/loadScene.js";
import StartScene from "./scenes/StartScene.js";

const config = {
    type: Phaser.AUTO,
    pixelArt: true,
    title: 'Survive Deeznuts',
    scale: {
        parent: 'game-container',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        zoom: 1
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
    scene: [
        LoadScene,
        StartScene,
        DesertScene
    ]
};

const game = new Phaser.Game(config);