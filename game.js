class MainScene extends Phaser.Scene {
    constructor() {
        super("main");
    }

    preload() {
        this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
        this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
        this.load.image('enemy', 'https://labs.phaser.io/assets/sprites/robot.png');
        this.load.image('sky', 'https://labs.phaser.io/assets/skies/deepblue.png');
    }

    create() {

        this.add.image(640, 360, 'sky').setScale(2);

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(640, 700, 'ground').setScale(4).refreshBody();

        this.player = this.physics.add.sprite(200, 500, 'player');
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, this.platforms);

        this.enemy = this.physics.add.sprite(900, 500, 'enemy');
        this.enemy.setBounce(1);
        this.enemy.setCollideWorldBounds(true);
        this.enemy.setVelocityX(-100);

        this.physics.add.collider(this.enemy, this.platforms);

        this.physics.add.overlap(this.player, this.enemy, this.hitEnemy, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
        }
        else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-500);
        }
    }

    hitEnemy(player, enemy) {
        this.scene.restart();
    }
}

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: MainScene
};

new Phaser.Game(config);