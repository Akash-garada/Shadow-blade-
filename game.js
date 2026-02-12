
        class MainScene extends Phaser.Scene {
    constructor() {
        super("main");
        this.health = 3;
        this.canDoubleJump = false;
        this.gameOver = false;
    }

    preload() {
        this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
        this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
        this.load.image('enemy', 'https://labs.phaser.io/assets/sprites/robot.png');
        this.load.image('sky', 'https://labs.phaser.io/assets/skies/deepblue.png');
    }

    create() {

        // Background
        this.add.image(640, 360, 'sky').setScale(2);

        // Platforms
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(640, 700, 'ground').setScale(4).refreshBody();

        // Player
        this.player = this.physics.add.sprite(200, 500, 'player');
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.platforms);

        // Enemy Group
        this.enemies = this.physics.add.group();
let enemy1 = this.enemies.create(900, 500, 'enemy');
enemy1.setVelocityX(-150);
enemy1.setCollideWorldBounds(true);
enemy1.setBounce(1);
enemy1.body.onWorldBounds = true;

this.physics.world.on('worldbounds', function(body) {
    if (body.gameObject === enemy1) {
        enemy1.setVelocityX(enemy1.body.velocity.x * -1);
    }
});
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.overlap(this.player, this.enemies, this.damagePlayer, null, this);

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

        // UI
        this.healthText = this.add.text(20, 20, 'Health: 3', { fontSize: '32px', fill: '#fff' });
    }

    update() {

        if (this.gameOver) return;

        // Movement
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
        }
        else {
            this.player.setVelocityX(0);
        }

        // Jump + Double Jump
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            if (this.player.body.touching.down) {
                this.player.setVelocityY(-500);
                this.canDoubleJump = true;
            } 
            else if (this.canDoubleJump) {
                this.player.setVelocityY(-500);
                this.canDoubleJump = false;
            }
        }

        // Attack
        if (Phaser.Input.Keyboard.JustDown(this.attackKey)) {
            this.enemies.children.iterate((enemy) => {
                if (enemy && Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y) < 100) {
                    enemy.destroy();
                }
            });
        }
    }

    damagePlayer(player, enemy) {

        this.health -= 1;
        this.healthText.setText('Health: ' + this.health);

        player.setTint(0xff0000);

        this.time.delayedCall(200, () => {
            player.clearTint();
        });

        if (this.health <= 0) {
            this.gameOver = true;
            this.add.text(500, 300, 'GAME OVER', { fontSize: '64px', fill: '#ff0000' });
        }
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