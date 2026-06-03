const gold = document.getElementById("gold");
const lives = document.getElementById("lives");
const wave = document.getElementById("wave");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const statusText = document.getElementById("status");
const gameBoard = document.getElementById("gameBoard");

let gameStarted = false;
let gameOver = false;
let currentWave = 1;
let enemies = [];
let towers = [];

function createEnemy() {

    const enemy = document.createElement("div");
    const healthBar = document.createElement("div");
    enemy.classList.add("enemy");
    healthBar.classList.add("enemy-health");
    enemy.appendChild(healthBar);

    enemy.health = 3 + currentWave;
    let position = -40;
    gameBoard.appendChild(enemy);
    enemies.push(enemy);

    const moveEnemy = setInterval(() => {

        if (gameOver) {

            clearInterval(moveEnemy);
            return;
        }

        position += 2;
        enemy.style.left = position + "px";

        if (position > 700) {

            clearInterval(moveEnemy);
            enemies = enemies.filter(item => item !== enemy);
            enemy.remove();
            lives.textContent = Number(lives.textContent) - 1;

            checkGameOver();
        }
    }, 20);

    enemy.moveEnemy = moveEnemy;
}

function startWave() {

    wave.textContent = currentWave;
    let spawned = 0;
    const waveSize = 5 + currentWave;

    const waveInterval = setInterval(() => {

        if (gameOver) {
            clearInterval(waveInterval);
            return;
        }

        createEnemy();
        spawned++;

        if (spawned >= waveSize) {
            clearInterval(waveInterval);
        }
    }, 1000);
}

function createBullet(tower, enemy) {

    const bullet = document.createElement("div");
    bullet.classList.add("bullet");

    let x = parseInt(tower.style.left);
    let y = parseInt(tower.style.top);

    bullet.style.left = x + "px";
    bullet.style.top = y + "px";
    gameBoard.appendChild(bullet);

    const bulletMove = setInterval(() => {

        if (!enemy.isConnected) {

            clearInterval(bulletMove);
            bullet.remove();
            return;
        }

        const enemyX = enemy.offsetLeft;
        const enemyY = enemy.offsetTop;

        x += (enemyX - x) * 0.15;
        y += (enemyY - y) * 0.15;

        bullet.style.left = x + "px";
        bullet.style.top = y + "px";

        const distance = Math.hypot(enemyX - x, enemyY - y);

        if (distance < 15) {

            clearInterval(bulletMove);
            bullet.remove();
            enemy.health--;

            enemy.firstChild.style.width = Math.max(enemy.health * 6, 0) + "px";

            if (enemy.health <= 0) {

                clearInterval(enemy.moveEnemy);
                enemies = enemies.filter(item => item !== enemy);
                enemy.remove();

                gold.textContent = Number(gold.textContent) + 10;
            }
        }
    }, 20);
}

function placeTower(x, y) {

    if (gameOver) {
        return;
    }

    const currentGold = Number(gold.textContent);

    if (currentGold < 20) {
        return;
    }

    const tower = document.createElement("div");
    tower.classList.add("tower");
    tower.style.left = x + "px";
    tower.style.top = y + "px";

    gameBoard.appendChild(tower);
    towers.push(tower);
    gold.textContent = currentGold - 20;
}

function attackEnemies() {setInterval(() => {

        if (gameOver) {
            return;
        }

        towers.forEach(tower => {
            const towerX = parseInt(tower.style.left);
            const towerY = parseInt(tower.style.top);

            enemies.forEach(enemy => {
                const enemyX = enemy.offsetLeft;
                const enemyY = enemy.offsetTop;
                const distance = Math.hypot(towerX - enemyX, towerY - enemyY);

                if (distance < 150) {

                    createBullet(tower, enemy);
                }

            });
        });
    }, 1000);
}

function checkGameOver() {

    if (Number(lives.textContent) <= 0) {

        gameOver = true;
        statusText.textContent = "Game Over";
        startBtn.disabled = true;
    }
}

function waveManager() {

    setInterval(() => {

        if (gameOver) {
            return;
        }

        if (enemies.length === 0 && gameStarted) {

            currentWave++;
            startWave();
        }

    }, 3000);
}

function restartGame() {

    enemies.forEach(enemy => {

        clearInterval(enemy.moveEnemy);

        if (enemy.isConnected) {
            enemy.remove();
        }
    });

    document.querySelectorAll(".bullet").forEach(bullet => {
        bullet.remove();
    });

    document.querySelectorAll(".tower").forEach(tower => {
        tower.remove();
    });

    enemies = [];
    towers = [];

    gameStarted = false;
    gameOver = false;
    currentWave = 1;

    gold.textContent = 100;
    lives.textContent = 10;
    wave.textContent = 1;

    statusText.textContent = "";
    startBtn.disabled = false;
    startBtn.textContent = "Start Game";
}

gameBoard.addEventListener("click", event => {

    const rect = gameBoard.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    placeTower(x, y);
});

startBtn.addEventListener("click", () => {

    if (gameStarted) {
        return;
    }

    gameStarted = true;
    startBtn.textContent = "Game Running";

    startWave();
    attackEnemies();
    waveManager();
});

restartBtn.addEventListener("click", () => {
    restartGame();
});