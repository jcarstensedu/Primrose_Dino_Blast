export default class Bullets {
    constructor(x, y, speed, damage, angle) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.damage = damage;
        this.angle = angle; // Direction the bullet will travel
        this.width = 8;
        this.height = 8;
        this.color = "gold";
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        // Update bullet position based on the angle
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        
    }

    collideWith(sprite) {
        // Your collision logic here (unchanged)
        if (sprite.pixelArt) {
            for (let row = 0; row < sprite.pixelArt.length; row++) {
                for (let col = 0; col < sprite.pixelArt[row].length; col++) {
                    if (sprite.pixelArt[row][col] === 1) {
                        const enemyX = sprite.x + col * sprite.scale;
                        const enemyY = sprite.y + row * sprite.scale;
                        const enemyWidth = sprite.scale;
                        const enemyHeight = sprite.scale;
                        if (
                            this.x < enemyX + enemyWidth &&
                            this.x + this.width > enemyX &&
                            this.y < enemyY + enemyHeight &&
                            this.y + this.height > enemyY
                        ) {
                            sprite.takeDamage(this.damage);
                            return true;
                        }
                    }
                }
            }
        } else {
            const isColliding =
                this.x < sprite.x + sprite.width &&
                this.x + this.width > sprite.x &&
                this.y < sprite.y + sprite.height &&
                this.y + this.height > sprite.y;
            if (isColliding) {
                sprite.takeDamage(this.damage);
                return true;
            }
        }
        return false;
    }
}
