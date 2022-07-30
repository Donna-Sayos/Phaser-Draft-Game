let player;

export default class CaveScene extends Phaser.Scene {
    constructor () {
        super({ key: "CaveScene" });
    }

    preload () {
        this.load.image('background', 'public/assets/bg/goblin-cave.png');
        this.load.spritesheet('baby', 'public/assets/sprites/mini-naked-baby.png', { frameWidth: 30, frameHeight: 45 });
    }

    create () {
        this.add.image(0, 0, 'background').setOrigin(0);

        player = this.physics.add.sprite(300, 350, 'baby');
        player.body.setSize(20, 25).setOffset(9, 19);
        player.setCollideWorldBounds(true);
    }
};