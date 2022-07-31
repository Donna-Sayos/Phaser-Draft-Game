let player;
// let cursors;
let invisibox;

export default class CaveScene extends Phaser.Scene {
    constructor () {
        super({ key: "CaveScene" });
    }

    preload () {
        this.load.image('background', 'public/assets/bg/goblin-cave.png');
        this.load.image('box', 'public/assets/objects/nobody.png');
        this.load.spritesheet('baby', 'public/assets/sprites/mini-naked-baby.png', { frameWidth: 37, frameHeight: 58 });
    }

    create () {
        this.cameras.main.setBounds(0, 0, 1024, 2000);

        this.add.image(0, 0, 'background').setOrigin(0);

        player = this.physics.add.sprite(180, 140, 'baby');
        player.body.setSize(23, 26).setOffset(7.5, 25);
        // player.setCollideWorldBounds(true);
        player.body.allowGravity = false;
        player.setGravity(0, 0);
        player.setVelocityY(0);

        this.cameras.main.startFollow(player); // .09, .09
        this.cameras.main.setZoom(2);

        invisibox = this.physics.add.image(155, 915, 'box').setScale(2).refreshBody().setImmovable(true);
        invisibox.body.setSize(100, 30).setOffset(35, 110); // .setSize adjusts the size of the bounding box; .setOffset adjusts the location of the bounding box;
        invisibox.body.allowGravity = false; 

        this.cursors = this.input.keyboard.createCursorKeys();

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('baby', {
                frames: [0, 1, 2, 3]
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('baby', { start: 4, end: 7 }),
            frameRate: 10, // The frame rate of playback in frames per second (default 24 if duration is null);
            repeat: -1
        });
    
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('baby', {
                frames: [8, 9, 10, 11]
            }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'walkup',
            frames: this.anims.generateFrameNumbers('baby', {
                frames: [12, 13, 14, 15]
            }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'baby', frames: 0 } ],
            frameRate: 20
        });

        this.physics.add.collider(player, invisibox);
    }

    update () {
        
        if (this.cursors.left.isDown) {
            player.setVelocityX(-160);
            // player.setAngle(-90);
            player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            player.setVelocityX(160);
            // player.setAngle(90); // rotates the player 90 when walking right;
            player.anims.play('right', true);
        } else if (this.cursors.up.isDown) {
            player.setVelocityY(-110);
            player.anims.play('walkup', true);
        } else if (this.cursors.down.isDown) {
            player.setVelocityY(180);
            player.anims.play('down', true);
        } else {
            player.setVelocityX(0);
            player.anims.play('turn');
        }
    
        // if (cursors.up.isDown && player.body.touching.down) {
        //     player.setAngle(0).setVelocityY(-360); // .setAngle(-180);
        // }
    }
};