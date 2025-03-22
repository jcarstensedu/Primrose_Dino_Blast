import Bullet from './Bullets.js';

export default class BulletController {
    bullets = [];
    timeTillNextBullet = 0;
    shootSound = new Audio("./sounds/Lzer2.mp3"); // Load sound

    constructor(canvas) {
        this.canvas = canvas;
        this.shootSound.volume = 0.4; // Adjust volume (0.0 - 1.0)
    }

    shoot(x, y, speed, damage, delay, mouseX, mouseY) {
        if (this.timeTillNextBullet <= 0) {
            // Play sound
            this.shootSound.currentTime = 0; // Reset to start
            this.shootSound.play();

            // Calculate angle from the player's position to the mouse
            const angle = Math.atan2(mouseY - y, mouseX - x);
            this.bullets.push(new Bullet(x, y, speed, damage, angle));
            this.timeTillNextBullet = delay;
        }
        this.timeTillNextBullet--;
    }

    draw(ctx) {
        this.bullets.forEach((bullet) => {
            if (this.isBulletOffScreen(bullet)) {
                const index = this.bullets.indexOf(bullet);
                this.bullets.splice(index, 1);
            }
            bullet.draw(ctx);
        });
    }

    collideWith(sprite) {
        return this.bullets.some((bullet) => {
            if (bullet.collideWith(sprite)) {
                this.bullets.splice(this.bullets.indexOf(bullet), 1);
                return true;
            }
            return false;
        });
    }

    isBulletOffScreen(bullet) {
        return bullet.y <= -bullet.height;
    }
}
