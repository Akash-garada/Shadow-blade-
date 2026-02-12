
        class MainScene extends Phaser.Scene {

    constructor() {
        super("main");

        // Game States
        this.health = 3;
        this.gameOver = false;

        // Controls
        this.moveLeft = false;
        this.moveRight = false;
        this.jumpPressed = false;
        this.attackPressed = false;

        this.canDoubleJump = false;
    }

    preload() {

        // Background
        this.load.image('sky', 'https://labs.phaser.io/assets/skies/deepblue.png');

        // Ground
        this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');

        // Player
        this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');

        // Enemy
        this.load.image('enemy', 'https://labs.phaser.io/assets/sprites/baddie.png');
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
        this.spawnEnemy(900, 500);

        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.overlap(this.player, this.enemies, this.damagePlayer, null, this);

        // Keyboard Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

        // Health UI
        this.healthText = this.add.text(20, 20, 'Health: 3', { fontSize: '32px', fill: '#fff' });

        // Mobile Controls
        this.createMobileControls();
    }

    spawnEnemy(x, y) {
        let enemy = this.enemies.create(x, y, 'enemy');
        enemy.setVelocityX(-150);
        enemy.setCollideWorldBounds(true);
        enemy.setBounce(1);
    }

    createMobileControls() {

        const style = {
            font: '30px Arial',
            fill: '#ffffff',
            backgroundColor: '#000000'
        };

        this.leftBtn = this.add.text(100, 650, '◀', style).setInteractive();
        this.rightBtn = this.add.text(200, 650, '▶', style).setInteractive();
        this.jumpBtn = this.add.text(1050, 650, '⤒', style).setInteractive();
        this.attackBtn = this.add.text(1150, 650, '⚔', style).setInteractive();

        this.leftBtn.on('pointerdown', () => this.moveLeft = true);
        this.leftBtn.on('pointerup', () => this.moveLeft = false);

        this.rightBtn.on('pointerdown', () => this.moveRight = true);
        this.rightBtn.on('pointerup', () => this.moveRight = false);

        this.jumpBtn.on('pointerdown', () => this.jumpPressed = true);
        this.jumpBtn.on('pointerup', () => this.jumpPressed = false);

        this.attackBtn.on('pointerdown', () => this.attackPressed = true);
        this.attackBtn.on('pointerup', () => this.attackPressed = false);
    }

    update() {

        if (this.gameOver) return;

        let movingLeft = this.cursors.left.isDown || this.moveLeft;
        let movingRight = this.cursors.right.isDown || this.moveRight;
        let jumping = Phaser.Input.Keyboard.JustDown(this.cursors.up) || this.jumpPressed;
        let attacking = Phaser.Input.Keyboard.JustDown(this.attackKey) || this.attackPressed;

        // Movement
        if (movingLeft) {
            this.player.setVelocityX(-200);
        }
        else if (movingRight) {
            this.player.setVelocityX(200);
        }
        else {
            this.player.setVelocityX(0);
        }

        // Jump
        if (jumping) {
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
        if (attacking) {
            this.enemies.children.iterate((enemy) => {
                if (enemy && Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y) < 120) {
                    enemy.destroy();
                }
            });
        }

        this.jumpPressed = false;
        this.attackPressed = false;
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