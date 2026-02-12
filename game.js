
        

        class ShadowBlade extends Phaser.Scene {

    constructor() {
        super("ShadowBlade");
        this.level = 1;
        this.health = 5;
        this.canDoubleJump = false;
    }

    preload() {
        this.load.image("sky", "https://labs.phaser.io/assets/skies/space3.png");
        this.load.image("ground", "https://labs.phaser.io/assets/sprites/platform.png");
        this.load.image("ninja", "https://labs.phaser.io/assets/sprites/phaser-dude.png");
        this.load.image("enemy", "https://labs.phaser.io/assets/sprites/baddie.png");
        this.load.image("trap", "https://labs.phaser.io/assets/sprites/spikedball.png");
    }

    create() {

        this.add.tileSprite(0,0,4000,720,"sky").setOrigin(0,0);

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(2000,700,"ground").setScale(8).refreshBody();

        this.player = this.physics.add.sprite(100,500,"ninja");
        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.player,this.platforms);

        this.enemies = this.physics.add.group();
        this.traps = this.physics.add.group();

        for(let i=1;i<=10;i++){
            this.enemies.create(600*i,500,"enemy")
                .setVelocityX(Phaser.Math.Between(-100,100))
                .setBounce(1)
                .setCollideWorldBounds(true);

            this.traps.create(800*i,650,"trap");
        }

        this.physics.add.collider(this.enemies,this.platforms);

        this.physics.add.overlap(this.player,this.enemies,this.hitEnemy,null,this);
        this.physics.add.overlap(this.player,this.traps,this.hitTrap,null,this);

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0,0,4000,720);
        this.physics.world.setBounds(0,0,4000,720);

        this.createButtons();

        this.healthText = this.add.text(20,20,"Health: 5",{fontSize:"24px",fill:"#fff"})
            .setScrollFactor(0);
    }

    createButtons(){

        const style = {
            font:"30px Arial",
            fill:"#fff",
            backgroundColor:"#000"
        };

        this.leftBtn = this.add.text(100,650,"◀",style).setScrollFactor(0).setInteractive();
        this.rightBtn = this.add.text(200,650,"▶",style).setScrollFactor(0).setInteractive();
        this.jumpBtn = this.add.text(1000,650,"⤒",style).setScrollFactor(0).setInteractive();
        this.doubleBtn = this.add.text(1100,650,"⤊",style).setScrollFactor(0).setInteractive();
        this.attackBtn = this.add.text(1200,650,"⚔",style).setScrollFactor(0).setInteractive();

        this.leftBtn.on("pointerdown",()=>this.player.setVelocityX(-200));
        this.rightBtn.on("pointerdown",()=>this.player.setVelocityX(200));

        this.leftBtn.on("pointerup",()=>this.player.setVelocityX(0));
        this.rightBtn.on("pointerup",()=>this.player.setVelocityX(0));

        this.jumpBtn.on("pointerdown",()=>{
            if(this.player.body.touching.down){
                this.player.setVelocityY(-500);
                this.canDoubleJump = true;
            }
        });

        this.doubleBtn.on("pointerdown",()=>{
            if(this.canDoubleJump){
                this.player.setVelocityY(-500);
                this.canDoubleJump = false;
            }
        });

        this.attackBtn.on("pointerdown",()=>{
            this.enemies.children.iterate(enemy=>{
                if(enemy && Phaser.Math.Distance.Between(
                    this.player.x,this.player.y,
                    enemy.x,enemy.y) < 120){
                        enemy.destroy();
                }
            });
        });
    }

    hitEnemy(player,enemy){
        this.health -=1;
        this.healthText.setText("Health: "+this.health);
        if(this.health<=0){
            this.scene.restart();
        }
    }

    hitTrap(player,trap){
        this.health -=1;
        this.healthText.setText("Health: "+this.health);
        if(this.health<=0){
            this.scene.restart();
        }
    }

    update(){
        if(this.player.body.touching.down){
            this.canDoubleJump = true;
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent:"game",
    physics:{
        default:"arcade",
        arcade:{
            gravity:{y:1000},
            debug:false
        }
    },
    scene:ShadowBlade
};

new Phaser.Game(config);