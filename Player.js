export default class Player {
    constructor(x, y, bulletController, scale = 6) {
        this.x = x;
        this.y = y;
        this.bulletController = bulletController;
        this.scale = scale;
        this.speed = 6;
        this.upPressed = false;
        this.downPressed = false;
        this.leftPressed = false;
        this.rightPressed = false;
        this.shootPressed = false;

        // Pixel art for the player (10 columns x 3 rows)
        this.pixelArt = [
            "0000111000",
            "0000111000",
            "0000111000",
        ];

        // Calculate the player's drawn dimensions:
        this.width = this.pixelArt[0].length * this.scale;  // 10 * scale
        this.height = this.pixelArt.length * this.scale;      // 3 * scale

        document.addEventListener("keydown", this.keydown);
        document.addEventListener("keyup", this.keyup);
        document.addEventListener("mousedown", this.mousedown);
        document.addEventListener("mouseup", this.mouseup);
    }

    draw(ctx, canvasWidth, canvasHeight) {
        this.move(canvasWidth, canvasHeight);  // Pass canvas width and height
        this.drawPixelArt(ctx);
        // Let the Player's own shoot method fire bullets (if shootPressed is true)
        this.shoot();
    }

    drawPixelArt(ctx) {
        for (let row = 0; row < this.pixelArt.length; row++) {
            for (let col = 0; col < this.pixelArt[row].length; col++) {
                if (this.pixelArt[row][col] === "1") {
                    ctx.fillStyle = "yellow"; // Color for the player pixels
                    ctx.fillRect(
                        this.x + col * this.scale,
                        this.y + row * this.scale,
                        this.scale,
                        this.scale
                    );
                }
            }
        }
    }

    shoot() {
        if (this.shootPressed) {
            const speed = 20;
            const delay = 17;
            const damage = 1;
            // Spawn bullet from the center of the player sprite
            const bulletX = this.x + this.width / 2;
            const bulletY = this.y + this.height / 2;
            this.bulletController.shoot(bulletX, bulletY, speed, damage, delay);
        }
    }

    move(canvasWidth, canvasHeight) {
        // Prevent moving off the top
        if (this.upPressed && this.y > 0) this.y -= this.speed;

        // Prevent moving off the bottom
        if (this.downPressed && this.y + this.height < canvasHeight) this.y += this.speed;

        // Prevent moving off the left
        if (this.leftPressed && this.x > 0) this.x -= this.speed;

        // Prevent moving off the right
        if (this.rightPressed && this.x + this.width < canvasWidth) this.x += this.speed;
    }

    keydown = (e) => {
        if (e.code === "KeyW") this.upPressed = true;
        if (e.code === "KeyS") this.downPressed = true;
        if (e.code === "KeyA") this.leftPressed = true;
        if (e.code === "KeyD") this.rightPressed = true;
    };

    keyup = (e) => {
        if (e.code === "KeyW") this.upPressed = false;
        if (e.code === "KeyS") this.downPressed = false;
        if (e.code === "KeyA") this.leftPressed = false;
        if (e.code === "KeyD") this.rightPressed = false;
    };

    mousedown = () => {
        this.shootPressed = true;
    };

    mouseup = () => {
        this.shootPressed = false;
    };
}
