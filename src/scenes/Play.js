class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('PlayBG', './assets/PlayBG.jpg');
        this.load.image('TheMudkip', './assets/MudkipShip.png');
        this.load.image('TheTorchic', './assets/TorchicShip.png')
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        //play background music
        this.sound.play('BGMusic');

        // place tile sprite
        this.PlayBG = this.add.tileSprite(0, 0, 640, 480, 'PlayBG').setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);

        // add Rocket (p1) 
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        this.playerTurn = (game.settings.multiplayer) ? 0 : 2; 
        this.switchTurn = false;

        // add Spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'TheMudkip', 0, 50).setOrigin(0, 0);
        this.ship01.moveSpeed *= 2;
        this.ship01.scale = 0.75;
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);
        this.speedIncrease = false;

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { 
                start: 0, 
                end: 9, 
                first: 0
            }),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        // GAME OVER flag
        this.gameOver = false;

        // Fire UI text
        this.fireText = this.add.text(game.config.width * 3/4, game.config.height/8, 'FIRE').setOrigin(0.5);
        this.fireText.visible = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← to Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
        const timedEvent = this.time.addEvent({
            delay: 30000,
            repeat: true,
            callback: () => {
              this.ship01.moveSpeed *= 1.50;
              this.ship02.moveSpeed *= 1.50;
              this.ship03.moveSpeed *= 1.50;
              console.log("speed increased");
            }
        });

        // display time in seconds
        this.timeText = this.add.text(game.config.width/2, game.config.height/8, '').setOrigin(0.5);
        this.gameTime = game.settings.gameTimer/1000;
        const timedEvent2 = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                if (!this.gameOver) {
                    this.gameTime -= 1;
                    this.timeText.text = this.gameTime;
                }
            }
        });
    }

    update() {
        // increase spaceship speed
        if (!this.speedIncrease && this.time.elapsed >= 30000) {
            this.ship01.moveSpeed *= 1.50;
            this.ship02.moveSpeed *= 2;
            this.ship03.moveSpeed *= 3;
            this.speedIncrease = true;
            console.log("speed increased");
        }

        // check key input for restart / menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.PlayBG.tilePositionX -= 4;  // update tile sprite

        if(!this.gameOver) {
            if (!this.p1Rocket.isFiring && this.switchTurn){
                this.switchTurn = false;
                if (this.playerTurn == 0){
                    this.p1Rocket.setTexture('TheTorchic');
                    this.playerTurn = 1;
                }
                else if (this.playerTurn == 1){
                    this.p1Rocket.setTexture('rocket');
                    this.playerTurn = 0;
                }
            }
            this.p1Rocket.update();             // update p1
             this.ship01.update();               // update spaceship (x3)
            this.ship02.update();
            this.ship03.update();
            if (this.p1Rocket.isFiring){
                this.fireText.visible = true;
                this.switchTurn = true;
            }
            else {
                this.fireText.visible = false;
            }
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
            this.clock.delay += 2000;
            this.gameTime += 2;
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
            this.clock.delay += 2000;
            this.gameTime += 2;
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
            this.clock.delay += 5000;
            this.gameTime += 5;
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;                         
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score; 
        
        let esound = "sfx_explosion" + (parseInt(Math.random()*5, 10)).toString()
        this.sound.play(esound);
      }
}