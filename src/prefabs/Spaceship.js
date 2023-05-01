// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   // add to existing scene
        this.points = pointValue;   // store pointValue
        this.moveSpeed = game.settings.spaceshipSpeed;         // pixels per frame
        if (parseInt(Math.random()*2, 10)) {
        this.moveSpeed *= -1;
        this.flipX = true;
        }
    }

    update() {
        // move spaceship left
        this.x -= this.moveSpeed;
        // wrap around from left edge to right edge
        if(this.moveSpeed > 0 && this.x <= 0 - this.width) {
            this.reset();
        }
        if(this.moveSpeed < 0 && this.x >= game.config.width + this.width) {
            this.reset();
        }
    }

    // position reset
    reset() {
        if (this.moveSpeed >= 0) {
            this.x = game.config.width;
        }
        else {
            this.x = 0
        }
    }
}