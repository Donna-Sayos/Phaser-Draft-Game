export default class StartScene extends Phaser.Scene {
    constructor () {
        super({ key: "StartScene" });
    }

    preload () {
        this.load.spritesheet('baby', 'public/assets/sprites/naked-baby.png', { frameWidth: 57, frameHeight: 65 });
        this.load.image('background', 'public/assets/bg/desert.png');
        this.load.image('play-button', 'public/assets/objects/play_button.png');
        this.load.audio('music', 'public/assets/audio/chill-music.mp3');
    }

    onClicked = () => {
        this.scene.start("DesertScene");
    }

    create () {
        // to have a fade effect when entering the scene;
        this.cameras.main.fadeFrom(2000, Phaser.Math.Between(50, 255), Phaser.Math.Between(50, 255), Phaser.Math.Between(50, 255), Phaser.Math.Between(50, 255));

        this.add.image(0, 0, 'background').setOrigin(0);

        this.add.text(this.game.renderer.width / 3.7, this.game.renderer.height * 0.20, 'Play with me 😏', { font: '50px monospace', fill: '#ffffff' });

        let player = this.physics.add.sprite(150, 350, 'baby').setCollideWorldBounds(true);
        player.body.allowGravity = false;
        player.setScale(1.5);
        player.setVisible(false);

        this.sound.pauseOnBlur = false;
        this.sound.play('music', { loop: true });

        this.anims.create({
            key: 'walk',
            framRate: 4,
            repeat: -1, // repeat forever;
            frames: this.anims.generateFrameNumbers('baby', {
                frames: [0, 1, 2, 3]
            })
        });

        let playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, 'play-button').setDepth(1);
        playButton.setInteractive();

        playButton.on("pointerover", () => {
            player.setVisible(true);
            player.play("walk");
            player.x = playButton.x - playButton.width;
            player.y = playButton.y;
        })
        playButton.on("pointerup", this.onClicked, this);
    }
};

/* 
    PointerEvents:

    pointerover - hovering
    pointerout - not hovering
    pointerup - click and release
    pointerdown - just click
*/