export default class Enemy {
    constructor(x, y, color, health, scale = 5) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.health = health;
        this.scale = scale; // Scale factor for pixel size

        // Random movement speed
        this.dx = Math.random() * 3 - 1; // Random direction along the x-axis (-1 to 1)
        this.dy = Math.random() * 3 - 1; // Random direction along the y-axis (-1 to 1)

        // Updated Raptor Pixel Art (Side Profile)
        this.pixelArt = [
            [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0],
            [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1],
            [0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1],
            [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1],
            [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1],
            [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0],
            [1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],
            [1,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],
            [1,1,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
            [1,1,1,0,0,1,1,1,1,1,1,1,1,0,1,0,0,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,1,1,0,0,0,1,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0],
        ];
    }

    // Update position based on random movement direction
    move() {
        this.x += this.dx;
        this.y += this.dy;

        // Check for canvas boundaries and reverse direction if necessary
        if (this.x <= 0 || this.x >= 800 - this.pixelArt[0].length * this.scale) {
            this.dx = -this.dx;
        }
        if (this.y <= 0 || this.y >= 800 - this.pixelArt.length * this.scale) {
            this.dy = -this.dy;
        }
    }

    draw(ctx) {
        this.move(); // Update position every frame

        ctx.fillStyle = this.color;

        // Loop through the 2D array to draw pixels
        for (let row = 0; row < this.pixelArt.length; row++) {
            for (let col = 0; col < this.pixelArt[row].length; col++) {
                if (this.pixelArt[row][col] === 1) {
                    ctx.fillRect(
                        this.x + col * this.scale, 
                        this.y + row * this.scale, 
                        this.scale, 
                        this.scale
                    );
                }
            }
        }

        // Draw health above the raptor
        ctx.fillStyle = "white";
        ctx.font = "15px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.health, this.x + (this.pixelArt[0].length * this.scale) / 2, this.y - 5);
    }

    takeDamage(damage) {
        this.health -= damage;
    }

    // Check if the enemy collides with the player
    collideWith(player) {
        // Loop through the enemy's pixel art and check for collision
        for (let row = 0; row < this.pixelArt.length; row++) {
            for (let col = 0; col < this.pixelArt[row].length; col++) {
                if (this.pixelArt[row][col] === 1) {
                    const enemyX = this.x + col * this.scale;
                    const enemyY = this.y + row * this.scale;
                    const enemyWidth = this.scale;
                    const enemyHeight = this.scale;

                    // Check for collision with player
                    if (
                        player.x < enemyX + enemyWidth &&
                        player.x + player.width > enemyX &&
                        player.y < enemyY + enemyHeight &&
                        player.y + player.height > enemyY
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}



