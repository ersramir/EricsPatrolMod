class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion0', './assets/explosion38.wav');
        this.load.audio('sfx_explosion1', './assets/Explosion1.wav');
        this.load.audio('sfx_explosion2', './assets/Explosion2.wav');
        this.load.audio('sfx_explosion3', './assets/Explosion3.wav');
        this.load.audio('sfx_explosion4', './assets/Explosion4.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
        this.load.audio('BGMusic', './assets/fsm-team-escp-space-floating.mp3');

        // load image
        this.load.image('RocketPatrolMenu', './assets/Rocket Patrol Menu.jpg');
    }

    create() {
        // background
        this.add.image(320, 240, 'RocketPatrolMenu');

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // Novice mode
          game.settings = {
            spaceshipSpeed: 3,
            gameTimer: 60000,
        multiplayer: false
          }
          this.sound.play('sfx_select');
          this.scene.start("playScene");    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // Expert mode
          game.settings = {
            spaceshipSpeed: 4,
            gameTimer: 45000,
        multiplayer: false
          }
          this.sound.play('sfx_select');
          this.scene.start("playScene");    
        }
        if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
          // Expert mode
          game.settings = {
            spaceshipSpeed: 3,
            gameTimer: 80000,
        multiplayer: true
          }
          this.sound.play('sfx_select');
          this.scene.start("playScene");    
        }
      }
}