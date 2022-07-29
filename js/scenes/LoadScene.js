export default class LoadScene extends Phaser.Scene {
    constructor () {
        super({ key: "loadScene" });
    }

    loadAudio = () => {
        this.load.setPath("public/assets/audio");
    }

    loadBg = () => {
        this.load.setPath("public/assets/bg");
    }

    loadObjects = () => {
        this.load.setPath("public/assets/objects");
    }

    preload () {
        this.load.spritesheet('baby', 'public/assets/sprites/naked-baby.png', { frameWidth: 50, frameHeight: 67 });
        this.load.image('ground', 'public/assets/tiles/desert-platform.png');
        this.load.image('lol', 'public/assets/objects/lol.png');

        this.loadAudio();
        this.loadBg();
        this.loadObjects();

        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        
        let loadingText = this.make.text({
            x: width / 2,
            y: height /2 -10,
            text: 'Loading...',
            style: {
                font: '30px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        let percent = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: 'monospace',
            fill: '#ffffff'
        });
        percent.setOrigin(0.5, -2);
        percent.depth = 1; // allows the percent to appear on top of the loading bar;

        let assetsText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '20px monospace',
                fill: "#ffffff"
            }
        });
        assetsText.setOrigin(0.5, -2);

        let loadingBar = this.add.graphics();
        let loadingBox = this.add.graphics();

        loadingBox.fillStyle(0x222222, 0.8);
        loadingBox.fillRect(140, this.game.renderer.height / 2, 520, 70); // .fillRect(x, y, width, height);

        // to make the loading bar load slower;
        for (let i = 0; i < 500; i++) {
            this.load.spritesheet("butt" + i, "public/assets/objects/butt.png");
        };

        this.load.on("progress", (num) => {
            loadingBar.clear();
            loadingBar.fillStyle(0xffffff, 1);
            loadingBar.fillRect(150, this.game.renderer.height / 1.97, 500 * num, 60);

            percent.setText(parseInt(num * 100) + '%');
        });

        this.load.on("fileprogress", (file) => {
            assetsText.setText('Loading asset: ' + file.key) // file.src - will only show the source of the file being loaded;
        })

        this.load.on("complete", () => {
            console.log('Loading comple...');

            loadingBar.destroy();
            loadingBox.destroy();
            loadingText.destroy();
            percent.destroy();
            assetsText.destroy();
        })
    }

    create () {
        this.add.image(400, 300, 'lol');
        setTimeout(() => {
            this.scene.start("StartScene");
        }, 800);
    }
};

/*
    Loader Events:

    complete - when done loading everything
    progress - loader number progress in decimal
    fileprogress - A reference to the File which errored during load
*/