import Player from "./Player.js";
import BulletController from "./BulletController.js";
import Enemy from "./Enemy.js";




const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const bgMusic = document.getElementById("bgMusic");



// Play music when the user interacts
document.addEventListener("click", () => {
    bgMusic.play();
});

// Optional: Stop function
function stopMusic() {
    bgMusic.pause();
    bgMusic.currentTime = 1;
}

canvas.width = 900;
canvas.height = 800;

const bulletController = new BulletController(canvas);
const player = new Player(canvas.width / 2, canvas.height / 2, bulletController);

let mouseX = 0;
let mouseY = 0;
let shootPressed = false; // Flag for continuous shooting

// Update mouse position on mouse move
canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
});

// Set flag on mouse down, clear it on mouse up
canvas.addEventListener("mousedown", () => {
    shootPressed = true;
});
canvas.addEventListener("mouseup", () => {
    shootPressed = false;
});

/* 
   ORIGINAL createRandomEnemies() function is kept here in case you need it later;
   however, for gradual (wave-based) spawning we will not use it directly.
*/
function createRandomEnemies(level) {
    const enemies = [];
    const colors = ["green", "red", "blue", "yellow", "purple", "hotpink", "orange", "black", "white", "silver", "aqua"];
    const enemyCount = 7 * Math.pow(2, level - 1); // Level 1: 7, Level 2: 14, etc.
    
    for (let i = 0; i < enemyCount; i++) {
        const x = Math.floor(Math.random() * 600);
        const y = Math.floor(Math.random() * 600);
        const color = colors[Math.floor(Math.random() * colors.length)];
        const health = Math.floor(Math.random() * 10) + 1;
        enemies.push(new Enemy(x, y, color, health));
    }
    return enemies;
}

/* 
   For wave-based spawning we now use these global variables:
   - enemies: the active enemy array (spawned gradually)
   - enemyTotal: how many enemies will eventually be spawned this level
   - enemySpawned: a counter for how many have been spawned so far
*/
let currentLevel = 1; // Start at level 1
let enemies = []; // Start with an empty array

let enemyTotal = 7 * Math.pow(2, currentLevel - 1); // Total enemies for current level
let enemySpawned = 0; // How many enemies have been spawned so far

let isGameOver = false;
let retryButton;
let levelButton;
let levelCompletePopup = document.createElement("div");  // For "Level Complete" popup
let winPopup = document.createElement("div"); // For "You Win" popup

// Wave spawning function: spawns up to 5 enemies every 3 seconds until enemyTotal is reached
function spawnWave() {
    const waveSize = Math.min(5, enemyTotal - enemySpawned);
    const colors = ["green", "red", "blue", "yellow", "purple", "hotpink", "orange", "black", "white", "silver", "aqua","pink","magenta","lime","teal","navy","maroon","olive",];

    for (let i = 0; i < waveSize; i++) {
        let x, y, dx, dy;
        // Loop until the generated (x, y) is at least 100px away from the player
        do {
            x = Math.floor(Math.random() * 600);
            y = Math.floor(Math.random() * 600);
            dx = x - player.x;
            dy = y - player.y;
        } while (Math.sqrt(dx * dx + dy * dy) < 150);

        const color = colors[Math.floor(Math.random() * colors.length)];
        const health = Math.floor(Math.random() * 10) + 1;
        enemies.push(new Enemy(x, y, color, health));
        enemySpawned++;
    }

    if (enemySpawned < enemyTotal) {
        setTimeout(spawnWave, 5000); // Spawn new wave every 3 seconds until total is reached
    }
}


// Consolidated reset game function
function resetGame() {
    // Reset game state to initial conditions
    isGameOver = false;
    currentLevel = 1; // Reset level to 1
    enemies = [];
    enemyTotal = 7 * Math.pow(2, currentLevel - 1);
    enemySpawned = 0;
    spawnWave(); // Begin gradual spawning for level 1
    player.x = canvas.width / 2.2; // Reset player position
    player.y = canvas.height / 1.3;
    bulletController.bullets = []; // Clear bullets
    retryButton.style.display = "none"; // Hide retry button after restart
    winPopup.style.display = "none"; // Hide win popup
    levelCompletePopup.style.display = "none"; // Hide level complete popup
    levelButton.style.display = "none"; // Hide the "Start Next Level" button
    gameLoop(); // Restart the game loop
}

function initializeRetryButton() {
    retryButton = document.createElement("button");
    retryButton.innerText = "Play Again";
    retryButton.style.fontSize = "20px";
    retryButton.style.padding = "10px 20px";
    retryButton.style.backgroundColor = "blue";
    retryButton.style.color = "white";
    retryButton.style.border = "none";
    retryButton.style.borderRadius = "5px";
    retryButton.style.cursor = "pointer";
    retryButton.style.position = "absolute";
    retryButton.style.top = "60%";
    retryButton.style.left = "50%";
    retryButton.style.transform = "translate(-50%, -50%)";
    retryButton.style.zIndex = "1000";
    retryButton.style.display = "none";

    document.body.appendChild(retryButton);

    retryButton.addEventListener("click", () => {
        resetGame(); // Reset the game state when retry is clicked
    });
}

function initializeLevelCompletePopup() {
    levelCompletePopup.style.position = "absolute";
    levelCompletePopup.style.top = "70%";
    levelCompletePopup.style.left = "50%";
    levelCompletePopup.style.transform = "translate(-50%, -50%)";
    levelCompletePopup.style.fontSize = "80px";
    levelCompletePopup.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    levelCompletePopup.style.color = "white";
    levelCompletePopup.style.padding = "10px";
    levelCompletePopup.style.borderRadius = "10px";
    levelCompletePopup.style.textAlign = "center";
    levelCompletePopup.style.display = "none";
    document.body.appendChild(levelCompletePopup);

    // Create "Start Next Level" button
    levelButton = document.createElement("button");
    levelButton.innerText = `Start Level ${currentLevel + 1}`;
    levelButton.style.fontSize = "20px";
    levelButton.style.padding = "10px 10px";
    levelButton.style.backgroundColor = "green";
    levelButton.style.color = "white";
    levelButton.style.border = "none";
    levelButton.style.borderRadius = "5px";
    levelButton.style.cursor = "pointer";
    levelButton.style.display = "none";
    levelCompletePopup.appendChild(levelButton);

    levelButton.addEventListener("click", () => {
        // Move to the next level
        currentLevel++;
        enemies = [];
        enemyTotal = 7 * Math.pow(2, currentLevel - 1);
        enemySpawned = 0;
        spawnWave(); // Start spawning enemies gradually for the new level
        player.x = canvas.width / 2.2;
        player.y = canvas.height / 1.3;
        bulletController.bullets = [];
        levelButton.innerText = `Continue to Level ${currentLevel + 1}`;
        levelCompletePopup.style.display = "none";
        retryButton.style.display = "none";
    });
}

let startScreen = document.createElement("div");
let startButton = document.createElement("button");

function initializeStartScreen() {
    startScreen.style.position = "absolute";
    startScreen.style.top = "50%";
    startScreen.style.left = "50%";
    startScreen.style.transform = "translate(-50%, -50%)";
    startScreen.style.fontSize = "30px";
    startScreen.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
    startScreen.style.color = "white";
    startScreen.style.padding = "20px";
    startScreen.style.borderRadius = "10px";
    startScreen.style.textAlign = "center";
    startScreen.style.zIndex = "1000";

    startScreen.innerHTML = `<p>Hold on to your butts! Primrose is overrun by Velociraptors<br><span style="font-size: 20px; color:green;">Use A, W, S, D to move and the Mouse to Shoot.</span></p>`;

    startButton.innerText = "Start Game";
    startButton.style.fontSize = "20px";
    startButton.style.padding = "10px 20px";
    startButton.style.backgroundColor = "green";
    startButton.style.color = "white";
    startButton.style.border = "none";
    startButton.style.borderRadius = "50px";
    startButton.style.cursor = "pointer";
    startButton.style.marginTop = "20px";

    startScreen.appendChild(startButton);
    document.body.appendChild(startScreen);

    startButton.addEventListener("click", () => {
        startScreen.style.display = "none";
        // Reset enemy spawning variables for level 1
        enemies = [];
        enemyTotal = 7 * Math.pow(2, currentLevel - 1);
        enemySpawned = 0;
        spawnWave(); // Start spawning the first wave
        gameLoop(); // Start the game loop
    });
}

initializeStartScreen();

function initializeWinPopup() {
    winPopup.style.position = "absolute";
    winPopup.style.top = "50%";
    winPopup.style.left = "50%";
    winPopup.style.transform = "translate(-50%, -50%)";
    winPopup.style.fontSize = "40px";
    winPopup.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    winPopup.style.color = "white";
    winPopup.style.padding = "20px";
    winPopup.style.borderRadius = "10px";
    winPopup.style.textAlign = "center";
    winPopup.style.display = "none";
    winPopup.innerHTML = `<p style="font-family: 'Courier New';">Congratulations You Have Saved Primrose!</p>`;

    document.body.appendChild(winPopup);
}

// Function to check if the level is complete
function checkLevelComplete() {
    if (enemies.length === 0 && levelCompletePopup.style.display === "none") {
        if (currentLevel >= 5) {
            winPopup.style.display = "block"; // Show "You Win!" if level 5 is cleared
            retryButton.style.display = "block";
        } else {
            levelCompletePopup.style.display = "block";
            levelButton.style.display = "block";
        }
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCommonStyle();
    ctx.fillStyle = "rgba(37, 18, 106, 33)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (isGameOver) {
        ctx.fillStyle = "red";
        ctx.font = "30px courier new";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("You have been eaten...", canvas.width / 2, canvas.height / 2 - 80);
        ctx.fillText ("And Primrose has fallen to the Velociraptors.", canvas.width / 2, canvas.height / 2 - 40);
        ctx.fillText("Better luck next time, kid.", canvas.width / 2, canvas.height / 2);
        levelButton.style.display = "none";
        retryButton.style.display = "block";
        return;
    }

    if (winPopup.style.display === "block") {
        ctx.fillStyle = "white";
        ctx.font = "30px courier new";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        retryButton.style.display = "block";
        return;
    }

    if (levelCompletePopup.style.display === "block") {
        ctx.fillStyle = "white";
        ctx.font = "30px courier new";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("You Have Done Well Here", canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillText("But Primrose Still Needs Your Help", canvas.width / 2, canvas.height / 2 + 20);
        retryButton.style.display = "none";
    }

    if (shootPressed) {
        bulletController.shoot(
            player.x + player.width / 2,
            player.y + player.height / 2,
            5, 0, 5, mouseX, mouseY
        );
    }

    bulletController.draw(ctx);
    player.draw(ctx, canvas.width, canvas.height);

    // Check collision and update enemy array
    enemies = enemies.filter((enemy) => {
        bulletController.bullets.forEach((bullet, bulletIndex) => {
            if (bullet.collideWith(enemy)) {
                console.log(`Bullet hit enemy at (${enemy.x}, ${enemy.y})`);
                bulletController.bullets.splice(bulletIndex, 1);
                enemy.health -= 1;
            }
        });

        if (enemy.collideWith(player)) {
            isGameOver = true;
            return false;
        }

        if (enemy.health > 0) {
            enemy.draw(ctx);
            return true;
        } else {
            return false;
        }
    });

    checkLevelComplete();
    requestAnimationFrame(gameLoop);
}

function setCommonStyle() {
    ctx.shadowColor = "#13B09D";
    ctx.shadowBlur = 0;
    ctx.lineJoin = "round";
    ctx.lineWidth = 0;
}

initializeRetryButton();
initializeLevelCompletePopup();
initializeWinPopup();
