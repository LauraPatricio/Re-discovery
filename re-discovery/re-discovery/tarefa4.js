let bg;
let circles = [];
let score = 0;
let lives = 3; 
const GOAL = 10;
let gameState = 'PLAY';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 500;

function preload() {
  bg = loadImage('tarefa4.png');
}

function setup() {
  createCanvas(GAME_WIDTH, GAME_HEIGHT);
}

function draw() {
  image(bg, 0, 0, GAME_WIDTH, GAME_HEIGHT);

  if (gameState === 'PLAY') {
    displayHUD();

    if (frameCount % 60 === 0 && circles.length < 3) {
      circles.push(new ClickCircle());
    }

    for (let i = circles.length - 1; i >= 0; i--) {
      circles[i].update();
      circles[i].show();

      if (circles[i].isExpired()) {
        // --- LOGIC CHANGE HERE ---
        if (circles[i].isClicked) {
          score++; // Only increment score when it closes if it was clicked
        } else {
          lives--; // Otherwise, it's a miss
          if (lives <= 0) gameState = 'GAMEOVER';
        }
        circles.splice(i, 1);
      }
    }

    if (score >= GOAL) {
      gameState = 'WIN';
    }
  } else if (gameState === 'GAMEOVER') {
    showGameOver();
  } else if (gameState === 'WIN') {
    showWinScreen();
  }
}

function displayHUD() {
  fill(0, 255, 255); 
  noStroke();
  textAlign(LEFT);
  textSize(24);
  text(`Superpower Charged: ${score} / ${GOAL}`, 60, 60);
  
  fill(255, 50, 50);
  text(`Shields: ${"❤️".repeat(lives)}`, 60, 90);
}

function showGameOver() {
  fill(0, 0, 0, 200);
  rect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  fill(255, 50, 50);
  textAlign(CENTER, CENTER);
  textSize(40);
  text("SYSTEM FAILURE", GAME_WIDTH / 2, GAME_HEIGHT / 2);
  textSize(20);
  fill(255);
  text("Press Space to Reboot", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50);
}

function showWinScreen() {
  fill(0, 255, 255, 200);
  rect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(40);
  text("MEMORY RECOVERED", GAME_WIDTH / 2, GAME_HEIGHT / 2);
  textSize(20);
  text("Press Space to Continue", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50);
}

function mousePressed() {
  if (gameState === 'PLAY') {
    for (let i = circles.length - 1; i >= 0; i--) {
      // We removed "score++" from here
      if (!circles[i].isClicked && circles[i].checkMouse(mouseX, mouseY)) {
        circles[i].isClicked = true; 
        break; 
      }
    }
  }
}

function keyPressed() {
  if ((gameState === 'WIN' || gameState === 'GAMEOVER') && key === ' ') {
    resetGame();
  }
}

function resetGame() {
  score = 0;
  lives = 3;
  circles = [];
  gameState = 'PLAY';
}

class ClickCircle {
  constructor() {
    this.x = random(100, GAME_WIDTH - 100);
    this.y = random(120, GAME_HEIGHT - 100);
    this.innerR = 40;
    this.outerR = 150; 
    this.shrinkSpeed = 1.2; 
    this.isClicked = false;
  }

  update() {
    this.outerR -= this.shrinkSpeed;
  }

  show() {
    strokeWeight(4);
    
    if (this.isClicked) {
      fill(0, 255, 100); 
      stroke(0, 255, 100); 
    } else {
      fill(0, 255, 255); 
      stroke(0, 255, 255); 
    }
    ellipse(this.x, this.y, this.innerR);
    
    noFill(); 
    if (this.isClicked) {
      stroke(0, 255, 100, 150);
    } else {
      stroke(255, 255, 255, 180);
    }
    strokeWeight(2);
    ellipse(this.x, this.y, this.outerR);
  }

  checkMouse(px, py) {
    let d = dist(px, py, this.x, this.y);
    return d < this.innerR / 2;
  }

  isExpired() {
    return this.outerR <= this.innerR;
  }
}