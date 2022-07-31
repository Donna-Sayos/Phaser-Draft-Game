export default class ToBeContinued extends Phaser.Scene {
    constructor () {
        super({ key: "ToBeContinued" });
    }

    preload () {
        this.load.image('incomplete', 'public/assets/bg/thanks.jpg');
        this.load.image('troll', 'public/assets/objects/troll.png');
    }

    create () {
        
        this.cameras.main.setBounds(0, 0, 1024, 2000);
        let bg = this.add.image(10, 34, 'incomplete').setOrigin(0);
        this.cameras.main.startFollow(bg);
        this.cameras.main.setZoom(2);
        this.cameras.main.roundPixels = true;

        setTimeout(() => {
            let trollFace = this.physics.add.image(0, 0, 'troll').setOrigin(0);
            trollFace.setCollideWorldBounds(true);
            trollFace.body.allowGravity = false;

            setTimeout(() => {
                this.scene.start("StartScene");
            }, 2000);
        }, 2000);

        // this.keys = this.input.keyboard.addKeys({
        //     s:  Phaser.Input.Keyboard.KeyCodes.S,
        //     d:  Phaser.Input.Keyboard.KeyCodes.D,
        //     w:  Phaser.Input.Keyboard.KeyCodes.W
        // });
    }
};