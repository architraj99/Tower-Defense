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

startBtn.addEventListener("click", () => {

    if(gameStarted) {
        return;
    }

    gameStarted = true;
    startBtn.textContent = "Wave Running";
    wave.textContent = currentWave;

    startWave();
});