let startScene = new Phaser.Scene('Title');

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
    scene: {
        startScene,
        preload: preload,
        create: create,
        update: update
    }
};

let player;
let iceCreams;
let poops;
let platform1;
let platform2;
let movingPlatform1;
let movingPlatform2;
let cursors;
let score = 0;
let gameOver = false;
let scoreText;

const game = new Phaser.Game(config);

function preload () {
    this.load.image('desert', 'public/desert.png');
    this.load.image('ground', 'public/desert-platform.png');
    this.load.image('iceCream', 'public/iceCream.png');
    this.load.image('poop', 'public/poop.png');
    this.load.spritesheet('baby', 'public/naked-baby.png', { frameWidth: 50, frameHeight: 67 }); // 51, 65
};

function create () {
    //  A simple background for the game
    this.add.image(400, 300, 'desert');

    // adds the floor for the game;
    platform1 = platform2 = movingPlatform2 = this.physics.add.staticGroup();
    //  Here we create the ground. Scale it to fit the width of the game
    platform1 = this.physics.add.image(530, 650, 'ground').setScale(2).refreshBody().setImmovable(true); // floor;
    platform1.body.setSize(530, 88, true);
    platform1.body.allowGravity = false;


    // adds some ledges
    platform2 = this.physics.add.image(100, 350, 'ground').setImmovable(true); // mid ledge;
    platform2.body.setSize(275, 60, true);
    platform2.body.allowGravity = false;

    movingPlatform1 = this.physics.add.image(650, 470, 'ground').setImmovable(true); // bot ledge;
    movingPlatform1.body.setSize(420, 50, true);
    movingPlatform1.body.allowGravity = false;
    movingPlatform1.setVelocityX(50);

    movingPlatform2 = this.physics.add.image(780, 220, 'ground').setImmovable(true); // top ledge;
    movingPlatform2.body.setSize(545, 50, true);
    movingPlatform2.body.allowGravity = false;
    movingPlatform2.setVelocityY(50);

    // The player and its settings
    player = this.physics.add.sprite(150, 350, 'baby'); //100, 450 || 150, 350
    player.body.setSize(35, 51, true);

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.5);
    player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
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

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  Some iceCreams to collect, 14 in total, evenly spaced 70 pixels apart along the x axis
    
    iceCreams = this.physics.add.group({
        key: 'iceCream',
        repeat: 13,
        setXY: { x: 12, y: 0, stepX: 58 }
    });

    iceCreams.children.iterate(function (child) {

        //  Give each iceCream a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)); // 0.4, 0.8

    });

    poops = this.physics.add.group();

    //  The score
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Collide the player and the iceCreams with the platforms
    this.physics.add.collider(player, platform1);
    this.physics.add.collider(player, platform2);
    this.physics.add.collider(player, movingPlatform1);
    this.physics.add.collider(player, movingPlatform2);
    
    this.physics.add.collider(iceCreams, platform1);
    this.physics.add.collider(iceCreams, platform2);
    this.physics.add.collider(iceCreams, movingPlatform1);
    this.physics.add.collider(iceCreams, movingPlatform2);

    this.physics.add.collider(poops, platform1);
    this.physics.add.collider(poops, platform2);
    this.physics.add.collider(poops, movingPlatform1);
    this.physics.add.collider(poops, movingPlatform2);

    //  Checks to see if the player overlaps with any of the iceCreams, if he does call the collecticeCream function
    this.physics.add.overlap(player, iceCreams, collecticeCream, null, this);

    this.physics.add.collider(player, poops, hitpoop, null, this);
};

function update () {
    if (gameOver) {
        return;
    }

    if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);

        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-360); // -330
    }

    if (movingPlatform1.x >= 500) {
        movingPlatform1.setVelocityX(-90); 
    } else if (movingPlatform1.x <= 300) {
        movingPlatform1.setVelocityX(90); 
    }

    if (movingPlatform2.y >= 300) {
        movingPlatform2.setVelocityY(-50); 
    } else if (movingPlatform2.y <= 200) {
        movingPlatform2.setVelocityY(50); 
    }
};

function collecticeCream (player, iceCream) {
    iceCream.disableBody(true, true);

    //  Add and update the score
    score += 20;
    scoreText.setText('Score: ' + score);

    if (iceCreams.countActive(true) === 1) {
        //  A new batch of iceCreams to collect
        iceCreams.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

            let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        let poop = poops.create(x, 16, 'poop');
        poop.setBounce(1);
        poop.setCollideWorldBounds(true);
        poop.setVelocity(Phaser.Math.Between(-200, 200), 20);
        poop.allowGravity = false;

    }
};

function hitpoop (player, poop) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
};