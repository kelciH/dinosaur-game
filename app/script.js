const game = document.querySelector(".game");
const dino = document.getElementById("dino");

const gameOver = document.getElementById("game-over");
let scoreElement = document.getElementById("score");
let score = 0;
let scoreInterval;

let isJumping = false;
let isGameOver = false;


// --- JUMP ---
function jump() {
  if (isJumping || isGameOver) return;
  isJumping = true;
  let position = 0;

  let upInterval = setInterval(() => {
    if (position >= 150) {
      clearInterval(upInterval);
      // Move down
      let downInterval = setInterval(() => {
        if (position <= 0) {
          clearInterval(downInterval);
          isJumping = false;
        }
        position -= 10;
        dino.style.bottom = (position + 5) + "px";
      }, 12);
    } else { 
      position += 10;
      dino.style.bottom = (position - 5) + "px";
    }
  }, 12);
}

// --- COLLISION DETECTION ---

    function checkCollision(obstacle) {
        let dinoRect = dino.getBoundingClientRect();
        let obstacleRect = obstacle.getBoundingClientRect();
      
        // Adjust dino hitbox if ducking
        if (dino.classList.contains("duck")) {
          dinoRect.top = dinoRect.bottom - 40; // match duck height
        }
      
        return (
          dinoRect.right > obstacleRect.left &&
          dinoRect.left < obstacleRect.right &&
          dinoRect.bottom > obstacleRect.top &&
          dinoRect.top < obstacleRect.bottom
        );
      }
    

// --- SCORE SYSTEM ---
function startScoring() {
  if (scoreInterval) clearInterval(scoreInterval);

  scoreInterval = setInterval(() => {
    if (isGameOver) {
      clearInterval(scoreInterval);
      return;
    }
    score++;
    scoreElement.textContent = score;
  }, 100);
}

  function createObstacle() {
    if (isGameOver) return;
  
    const obstacleType = Math.random() < 0.7 ? "cactus" : "bird"; // 70% cactus, 30% bird
    const obstacle = document.createElement("div");
    obstacle.classList.add(obstacleType);
    game.appendChild(obstacle);
  
    // Remove obstacle after animation
    obstacle.addEventListener("animationend", () => obstacle.remove());
  
    // Collision detection for this obstacle
    const collisionInterval = setInterval(() => {
      if (isGameOver) {
        clearInterval(collisionInterval);
        //dino.classList.add("dino-end");
        return;
        
      }
      if (checkCollision(obstacle)) {
        //dino.classList.add("dino-end");
        endGame();
        clearInterval(collisionInterval);
      }
    }, 10);
  
    // Schedule next obstacle (random between 1–3 seconds)
    const randomTime = Math.random() * 2000 + 1000;
    setTimeout(createObstacle, randomTime);
  }

  // --- END GAME ---
function endGame() {
    isGameOver = true;
    gameOver.classList.remove("hidden");
    dino.classList.remove("running");
    dino.classList.add("dino-end");
    document.querySelectorAll(".cactus, .bird").forEach(obstacle => obstacle.remove());
    clearInterval(scoreInterval);
  }

// --- RESET GAME ---
function resetGame() {
    isGameOver = false;
    score = 0;
    scoreElement.textContent = score;
    gameOver.classList.add("hidden");
    startScoring();
    createObstacle();
  }

// --- CONTROLS ---
dino.classList.add("running");

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") {
      if (isGameOver) {
        resetGame();
      } else {
        jump();
        if (score === 0) startScoring();
        dino.classList.remove("running");
      }
    }
  
    // 🦆 Duck when ArrowDown pressed
    if (e.code === "ArrowDown" && !isJumping && !isGameOver) {
      dino.classList.remove("running");
      dino.classList.add("duck");
    }
  });
  
  // Release duck when ArrowDown is released
  document.addEventListener("keyup", (e) => {
    if (e.code === "ArrowDown" && !isJumping && !isGameOver) {
      dino.classList.remove("duck");
      dino.classList.add("running");
    }
    if (e.code === "Space" || e.code === "ArrowUp") {
        dino.classList.remove("duck");
        dino.classList.add("running");
    }
  });

  createObstacle();