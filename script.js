const gold = document.getElementById("gold");
const lives = document.getElementById("lives");
const wave = document.getElementById("wave");
const startBtn = document.getElementById("startBtn");
const gameBoard = document.getElementById("gameBoard");

let gameStarted = false;
let currentWave = 1;

function createEnemy() {

    const enemy = document.createElement("div");
    enemy.classList.add("enemy");

    let position = -40;
    gameBoard.appendChild(enemy);

    const moveEnemy = setInterval(() => {

        position += 2;
        enemy.style.left = position + "px";

        if(position > 700) {

            clearInterval(moveEnemy);
            enemy.remove();
            lives.textContent = Number(lives.textContent) - 1;
        }
    }, 20);
}

function startWave() {

    let spawned = 0;
    const waveSize = 5 + currentWave;

    const waveInterval = setInterval(() => {

        createEnemy();
        spawned++;

        if(spawned >= waveSize) {

            clearInterval(waveInterval);
        }
    }, 1000);
}

function placeTower(x, y) {

    const currentGold = Number(gold.textContent);

    if(currentGold < 20) {
        return;
    }

    const tower = document.createElement("div");
    tower.classList.add("tower");
    tower.style.left = x + "px";
    tower.style.top = y + "px";

    gameBoard.appendChild(tower);
    gold.textContent = currentGold - 20;
}

gameBoard.addEventListener("click", (event) => {

    const rect = gameBoard.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    placeTower(x, y);
});

startBtn.addEventListener("click", () => {

    if(gameStarted) {
        return;
    }

    gameStarted = true;
    startBtn.textContent = "Wave Running";
    wave.textContent = currentWave;

    startWave();
});