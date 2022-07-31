let player;
let iceCreams;
let poops;
let portals;
let platform1;
let platform2;
let movingPlatform1;
let movingPlatform2;
let movingPlatform3;
let movingPlatform4;
let stoneBlock;
let stoneBlockA;
let cursors;
let gameOver = false;
let scoreText;
const gameState = {
    score: 0
}

export default class DesertScene extends Phaser.Scene {
    constructor () {
        super({ key: "DesertScene" });
    }

    preload () { // where to load images or sounds;
        this.load.image('desert', 'public/assets/bg/desert.png');
        this.load.image('ground', 'public/assets/tiles/desert-platform.png');
        this.load.image('mini', 'public/assets/tiles/mini-platform.png');
        this.load.image('iceCream', 'public/assets/objects/iceCream.png');
        this.load.image('poop', '/public/assets/objects/poop.png');
        this.load.image('stone-block', 'public/assets/objects/StoneBlock.png');
        this.load.image('portal', 'public/assets/objects/portal.png');
        this.load.spritesheet('baby', 'public/assets/sprites/mini-naked-baby.png', { frameWidth: 37, frameHeight: 58 }); // 57, 70
        this.load.audio('pickup-audio', 'public/assets/audio/pickup.mp3');
        this.load.audio('explosion-audio', 'public/assets/audio/explosion.mp3');
        this.load.audio('portal-audio', 'public/assets/audio/portal-audio.mp3');
    }

    create () { // where to define objects;
        this.cameras.main.setBounds(0, 0, 1024, 2000);

        //  A simple background for the game
        this.add.image(0, 0, 'desert').setOrigin(0).setScrollFactor(1);

        // adds the floor for the game; here we create the ground. Scale it to fit the width of the game 
        platform1 = this.physics.add.image(530, this.game.renderer.height + 40 , 'ground').setScale(2).refreshBody().setImmovable(true); // floor;
        platform1.body.setSize(400, 30).setOffset(35, 110); // .setSize adjusts the size of the bounding box; .setOffset adjusts the location of the bounding box;
        platform1.body.allowGravity = false;
    
    
        // adds some ledges
        platform2 = this.physics.add.image(100, 350, 'ground').setImmovable(true); // 2nd ledge;
        platform2.body.setSize(275, 30).setOffset(160, 110);
        platform2.body.allowGravity = false;
    
        movingPlatform1 = this.physics.add.image(650, 470, 'mini').setImmovable(true); // 3rd
        movingPlatform1.body.setSize(150, 40).setOffset(150, 194);
        movingPlatform1.body.allowGravity = false;
        movingPlatform1.setVelocityX(50);
    
        movingPlatform2 = this.physics.add.image(780, 220, 'ground').setImmovable(true); // 1st ledge;
        movingPlatform2.body.setSize(300, 30).setOffset(24, 110);
        movingPlatform2.body.allowGravity = false;
        movingPlatform2.setVelocityY(50);

        movingPlatform3 = this.physics.add.image(650, this.game.renderer.height - 250, 'mini').setImmovable(true); // bot mini ledge;
        movingPlatform3.body.setSize(150, 40).setOffset(150, 194);
        movingPlatform3.body.allowGravity = false;
        movingPlatform3.setVelocityX(50);

        movingPlatform4 = this.physics.add.image(500, 800, 'mini').setImmovable(true); // 4th ledge;
        movingPlatform4.body.setSize(150, 30).setOffset(150, 194);
        movingPlatform4.body.allowGravity = false;
        movingPlatform4.setVelocityY(50);

        stoneBlockA = this.physics.add.staticGroup();

        stoneBlockA.create(650, this.game.renderer.height - 150, 'stone-block'); // mid;
        stoneBlockA.create(730, this.game.renderer.height - 400, 'stone-block'); // right;
        stoneBlockA.create(150, this.game.renderer.height - 300, 'stone-block'); // left;

        stoneBlock = this.physics.add.image(70, this.game.renderer.height - 150, 'stone-block').setImmovable(true); // moving stone block;
        stoneBlock.body.allowGravity = false;
        stoneBlock.setVelocity(100, -100);

        this.tweens.timeline({
            targets: stoneBlock.body.velocity,
            loop: -1,
            tweens: [
              { x:    0, y: -180, duration: 2000, ease: 'Stepped' },
              { x:    0, y:    0, duration: 1000, ease: 'Stepped' },
              { x:  150, y:  80, duration: 4000, ease: 'Stepped' },
              { x:    0, y: -180, duration: 2000, ease: 'Stepped' },
              { x:    0, y:    0, duration: 1000, ease: 'Stepped' },
              { x: -150, y:  100, duration: 4000, ease: 'Stepped' }
            ]
        });
    
        // The player and its settings
        gameState.player = this.physics.add.sprite(20, 350, 'baby');
        gameState.player.body.setSize(23, 26).setOffset(7.5, 25); // 30, 35 || 13, 28
    
        //  gameState.Player physics properties. Give the little guy a slight bounce.
        gameState.player.setBounce(0.5);
        gameState.player.setCollideWorldBounds(true);

        // to have the camera focus on the player;
        this.cameras.main.startFollow(gameState.player); // .09, .09
        this.cameras.main.setZoom(1.4);
        this.cameras.main.roundPixels = true;
    
        // gameState.player animations, turning, walking left and walking right.
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('baby', { start: 4, end: 7 }),
            frameRate: 10, // The frame rate of playback in frames per second (default 24 if duration is null);
            repeat: -1
        });
    
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'baby', frames: 0 } ],
            frameRate: 20
        });
    
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('baby', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        // sounds
        this.pickUpSound = this.sound.add("pickup-audio");
        this.explosionSound = this.sound.add("explosion-audio");
        this.portalSound = this.sound.add("portal-audio");
    
        //  Input Events
        cursors = this.input.keyboard.createCursorKeys();
    
        //  Some iceCreams to collect, 15 in total, evenly spaced 70 pixels apart along the x axis
        iceCreams = this.physics.add.group({
            key: 'iceCream',
            repeat: 14,
            setXY: { x: 12, y: 0, stepX: 55 }
        });
        
    
        iceCreams.children.iterate(function (child) {
    
            //  Give each iceCream a slightly different bounce
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.6)); 
    
        });
    
        poops = this.physics.add.group();
        portals = this.physics.add.group();
    
        //  The score
        gameState.scoreText = this.add.text(14, 14, 'score: 0', { fontSize: '40px', fill: '#000' });
           
        //  Collide the gameState.player and the iceCreams with the platforms
        this.physics.add.collider(gameState.player, platform1);
        this.physics.add.collider(gameState.player, platform2);
        this.physics.add.collider(gameState.player, stoneBlock);
        this.physics.add.collider(gameState.player, stoneBlockA);
        this.physics.add.collider(gameState.player, movingPlatform1);
        this.physics.add.collider(gameState.player, movingPlatform2);
        this.physics.add.collider(gameState.player, movingPlatform3);
        this.physics.add.collider(gameState.player, movingPlatform4);
        
        this.physics.add.collider(iceCreams, platform1);
        this.physics.add.collider(iceCreams, platform2);
        this.physics.add.collider(iceCreams, stoneBlock);
        this.physics.add.collider(iceCreams, stoneBlockA);
        this.physics.add.collider(iceCreams, movingPlatform1);
        this.physics.add.collider(iceCreams, movingPlatform2);
        this.physics.add.collider(iceCreams, movingPlatform3);
        this.physics.add.collider(iceCreams, movingPlatform4);

        this.physics.add.collider(portals, platform1);
        this.physics.add.collider(portals, platform2);
        this.physics.add.collider(portals, stoneBlock);
        this.physics.add.collider(portals, stoneBlockA);
        this.physics.add.collider(portals, movingPlatform1);
        this.physics.add.collider(portals, movingPlatform2);
        this.physics.add.collider(portals, movingPlatform3);
        this.physics.add.collider(portals, movingPlatform4);
    
        this.physics.add.collider(poops, platform1);
        this.physics.add.collider(poops, platform2);
        this.physics.add.collider(poops, stoneBlock);
        this.physics.add.collider(poops, stoneBlockA);
        this.physics.add.collider(poops, portals);
        this.physics.add.collider(poops, movingPlatform1);
        this.physics.add.collider(poops, movingPlatform2);
        this.physics.add.collider(poops, movingPlatform3);
        this.physics.add.collider(poops, movingPlatform4);
            
        //  Checks to see if the gameState.player overlaps with any of the iceCreams, if he does call the collecticeCream function
        this.physics.add.overlap(gameState.player, iceCreams, this.collecticeCream, null, this);
        this.physics.add.collider(gameState.player, poops, this.hitpoop, null, this);
        this.physics.add.collider(gameState.player, portals, this.hitPortal, null, this);
    }

    update () { // where the loop goes; 
        if (cursors.left.isDown) {
            gameState.player.setVelocityX(-160);
            // gameState.player.setAngle(-90);
    
            gameState.player.anims.play('left', true);
        } else if (cursors.right.isDown) {
            gameState.player.setVelocityX(160);
            // gameState.player.setAngle(90); // rotates the player 90 when walking right;
    
            gameState.player.anims.play('right', true);
        } else {
            gameState.player.setVelocityX(0);
    
            gameState.player.anims.play('turn');
        }
    
        if (cursors.up.isDown && gameState.player.body.touching.down) {
            gameState.player.setAngle(0).setVelocityY(-360); // .setAngle(-180);
        }
    
        if (movingPlatform1.x >= 700) {
            movingPlatform1.setVelocityX(-100); 
        } else if (movingPlatform1.x <= 300) {
            movingPlatform1.setVelocityX(100);
        }
    
        if (movingPlatform2.y >= 300) {
            movingPlatform2.setVelocityY(-50); 
        } else if (movingPlatform2.y <= 100) {
            movingPlatform2.setVelocityY(50); 
        }

        if (movingPlatform3.x >= 700) {
            movingPlatform3.setVelocityX(-100); 
        } else if (movingPlatform3.x <= 300) {
            movingPlatform3.setVelocityX(100);
        }

        if (movingPlatform4.y >= 800) {
            movingPlatform4.setVelocityY(-90); 
        } else if (movingPlatform4.y <= 550) {
            movingPlatform4.setVelocityY(50); 
        }

        if (stoneBlock.y >= 300) {
            stoneBlock.setVelocityY(-60); 
        } else if (stoneBlock.y <= 200) {
            stoneBlock.setVelocityY(60); 
        }
    }

    collecticeCream = (player, iceCream) => {
        iceCream.disableBody(true, true);

        this.pickUpSound.play();
    
        //  Add and update the score
        gameState.score += 20;
        gameState.scoreText.setText(`score: ${gameState.score}`);
    
        if (iceCreams.countActive(true) === 6) {
            //  A new batch of iceCreams to collect
            iceCreams.children.iterate(function (child) {
    
                child.enableBody(true, child.x, 0, true, true);
    
            });
            let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    
            let poop = poops.create(x, 20, 'poop'); 
            poop.setBounce(1);
            poop.setSize(25, 23).setOffset(12, 15);
            poop.setCollideWorldBounds(true);
            poop.setVelocity(Phaser.Math.Between(-200, 200), 20);
            poop.allowGravity = false;  
        } else {
            if (gameState.score === 20) {

                let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

                let portal = portals.create(x, 30, 'portal');
                portal.setSize(100, 100).setOffset(17, 19);
                portal.setVelocity(Phaser.Math.Between(-200, 200), 20);
                portal.setCollideWorldBounds(true);
                portal.allowGravity = false;
            }
        }
    }

    hitPortal = (player, portal) => {
        this.portalSound.play();
        player.setTint(0x00ff00);
        this.scene.start('ToBeContinued');

        player.setScale
    }

    hitpoop = (player, poop) => {
        this.explosionSound.play();

        this.physics.pause();
    
        player.setTint(0xff0000); // gives the gameState.player a red tint when hit;
        this.add.text(this.game.renderer.width / 2.5, this.game.renderer.height * 0.20, 'Game Over', { font: '30px monospace', fill: '#000000' });
        this.add.text(this.game.renderer.width / 2.5, this.game.renderer.height * 0.40, 'Click to restart', { font: '20px monospace', fill: '#000000' });

        this.input.on("pointerup", () => {
            gameState.score = 0;
            this.scene.restart();
        });

        player.anims.play('turn');
    
        gameOver = true;
    }
};