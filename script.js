let interval = null;
let playing = false;
let hits = 0;
let missed = 0;
let accuracy = 0;
let time = 0;
let unlimited = false;
let difficulty = 0;

const startBtn = document.querySelector("#start");
const screens = document.querySelectorAll(".screen");
const timeList = document.querySelector("#time-list");
const difficultyList = document.querySelector("#difficulty-list");
const timeEl = document.querySelector("#time");
const board = document.querySelector("#board");
const hitsEl = document.querySelector("#hits");
const accuracyEl = document.querySelector("#accuracy");
const hitsOver = document.querySelector("#hits-over");
const accuracyOver = document.querySelector("#accuracy-over");
const hearts = document.querySelectorAll(".heart");
const restartBtns = document.querySelectorAll(".restart");
const fullScreenBtn = document.querySelector("#fullscreen");
const minimizeBtn = document.querySelector("#minimize");
function createRandomCircle() {
    if (!playing) {
        return;
    }

    const circle = document.createElement("div");
    const size = getRandomNumber(30, 100);
    const colors = ["#03DAC6", "#FF026", "#b3ff00", "#ccff00", "#9D00FF"];
    const { width, height } = board.getBoundingClientRect();
    const x = getRandomNumber(0, width - size);
    const y = getRandomNumber(0, height - size);
    
    circle.classList.add("circle");
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
    circle.style.top = `${y}px`;
    circle.style.left = `${x}px`;
    const color = Math.floor(Math.random() * colors.length);
    circle.style.background = colors[color];

    board.append(circle);

    if (difficulty === 1) {
        circle.style.animationDuration = "2s";
    } else if (difficulty === 2) {
        circle.style.animationDuration = "1s";
    } else {
        circle.style.animationDuration = "3s";
    }
    circle.addEventListener("animationend", () => {
        circle.remove();
        createRandomCircle();
        addMissed();
        calculateAccuracy();
    });
}

function StartGame() {
    playing = true;
    interval = setInterval(decreaseTime, 1000);
    createRandomCircle();
}

startBtn.addEventListener("click", () => {
    screens[0].classList.add("up");
});

timeList.addEventListener("click", (e) => {
    if (e.target.classList.contains("time-btn")) {
        time = parseInt(e.target.getAttribute("data-time"));
        unlimited = e.target.getAttribute("data-unlimited") === "true";
        screens[1].classList.add("up");
    }
});
difficultyList.addEventListener("click", (e) => {
    if (e.target.classList.contains("difficulty-btn")) {
        difficulty = parseInt(e.target.getAttribute("data-difficulty"));
        screens[2].classList.add("up");
        StartGame();
    }
});

function decreaseTime() {
    if (unlimited) {
        setTime("∞");
        return;
    }
    if (time === 0) {
        finishGame();
        return;
    }
    time--;
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    seconds = seconds < 10 ? 0`${seconds}` : seconds;
    minutes = minutes < 10 ? 0`${minutes}` : minutes;
    setTime(`${minutes}:``${seconds}`);
}

function setTime(value) {
    timeEl.innerHTML = value;
}
board.addEventListener("click", (e) => {
    if (e.target.classList.contains("circle")) {
        hits++;
        e.target.remove();
        createRandomCircle();
    } else {
        missed++;
    }
    hitsEl.innerHTML = hits;
    calculateAccuracy();
});

function finishGame() {
    playing = false;
    clearInterval(interval);
    board.innerHTML = "";
    screens[3].classList.add("up");
    hitsEl.innerHTML = 0;
    timeEl.innerHTML = "00:00";
    accuracyEl.innerHTML = "0%";
    hitsOver.innerHTML = hits;
    accuracyOver.innerHTML = `${accuracy}%`;
}
function addMissed() {
    if ([...hearts].every(heart => heart.classList.contains("dead"))) {
        finishGame();
    } else {
        missed++;
        for (let heart of hearts) {
            if (!heart.classList.contains("dead")) {
                heart.classList.add("dead");
                break;
            }
        }
    }
}

function calculateAccuracy() {
    accuracy = (hits / (hits + missed)) * 100;
    accuracy = accuracy.toFixed(2);
    accuracyEl.innerHTML = `${accuracy}%`;
}

function getRandomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}
restartBtns.forEach(btn => {
    btn.addEventListener("click", restartGame);
});

function restartGame() {
    finishGame();
    screens[1].classList.remove("up");
    screens[2].classList.remove("up");
    screens[3].classList.remove("up");
    time = 0;
    difficulty = 0;
    hits = 0;
    missed = 0;
    accuracy = 0;
    playing = false;
    unlimited = false;
    hearts.forEach(heart => heart.classList.remove("dead"));
}

fullScreenBtn.addEventListener("click", fullscreen);
let elem = document.documentElement;

function fullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
    fullScreenBtn.style.display = "none";
    minimizeBtn.style.display = "block";
}

minimizeBtn.addEventListener("click", minimize);

function minimize() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
    minimizeBtn.style.display = "none";
    fullScreenBtn.style.display = "block";
}


