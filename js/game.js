import CaveScene from "./scenes/CaveScene.js";
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
        
    },
    width: 800, 
    height: 1120, 
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 }, 
            debug: false,
        },
    },
    scene: [
        // LoadScene,
        // StartScene,
        DesertScene,
        CaveScene
    ]
};

const game = new Phaser.Game(config);