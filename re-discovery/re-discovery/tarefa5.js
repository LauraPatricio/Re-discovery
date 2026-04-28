let bg;
let rings = [];
let currentRing = 0; 
let gameState = 'PLAY'; 
const GOAL = 3;

const GAME_WIDTH = 900;
const GAME_HEIGHT = 500;

// Definimos estas variáveis globalmente para garantir que são iguais em todo o lado
let bX = 90; 
let bW = 210;
let bH = 60;
let bY_positions = [98, 220, 341]; 

function preload() {
  bg = loadImage('tarefa5.png');
}

function setup() {
  createCanvas(GAME_WIDTH, GAME_HEIGHT);
  
  // Purple (Top), Blue (Middle), Green (Bottom) [cite: 151]
  rings.push(new SyncRing(425, 130, color(147, 32, 146))); 
  rings.push(new SyncRing(425, 250, color(31, 64, 153)));  
  rings.push(new SyncRing(425, 372, color(0, 169, 127)));  
}

function draw() {
  image(bg, 0, 0, GAME_WIDTH, GAME_HEIGHT);

  if (gameState === 'PLAY') {
    displayHUD();
    drawDebugButtons(); 

    for (let i = 0; i < rings.length; i++) {
      rings[i].update();
      rings[i].show();
    }

    if (currentRing >= GOAL) {
      gameState = 'WIN';
    }
  } else if (gameState === 'WIN') {
    showWinScreen();
  }
}

function drawDebugButtons() {
  for (let i = 0; i < bY_positions.length; i++) {
    if (i === currentRing) {
      fill(0, 255, 255, 100); 
    } else {
      fill(255, 0, 0, 50);    
    }
    stroke(255);
    rect(bX, bY_positions[i], bW, bH);
  }
}

function displayHUD() {
  fill(0, 255, 255);
  noStroke();
  textAlign(LEFT);
  textSize(20);
  text("SYNC INSTRUMENTS: " + currentRing + " / " + GOAL, 60, 60);
}

function showWinScreen() {
  fill(0, 0, 0, 200);
  rect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  fill(0, 255, 255);
  textAlign(CENTER, CENTER);
  textSize(40);
  text("HARMONY RESTORED", GAME_WIDTH / 2, GAME_HEIGHT / 2);
  textSize(20);
  fill(255);
  text("Memory Fragment Secured. Press Space to Continue.", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50);
}

function mousePressed() {
  if (gameState === 'PLAY') {
    // Agora o mousePressed usa exatamente as mesmas variáveis do desenho 
    if (mouseX > bX && mouseX < bX + bW &&
        mouseY > bY_positions[currentRing] && mouseY < bY_positions[currentRing] + bH) {
      
      if (rings[currentRing].checkSync()) {
        rings[currentRing].isSynced = true;
        currentRing++;
      }
    }
  }
}

function keyPressed() {
  if (gameState === 'WIN' && key === ' ') {
    resetGame();
  }
}

function resetGame() {
  currentRing = 0;
  for (let ring of rings) {
    ring.isSynced = false;
    ring.angle = random(TWO_PI);
  }
  gameState = 'PLAY';
}

class SyncRing {
  constructor(x, y, col) {
    this.x = x;
    this.y = y;
    this.col = col;
    this.angle = random(TWO_PI);
    this.speed = 0.04; // Velocidade constante para teste
    this.isSynced = false;
    this.radius = 70; 
  }

  update() {
    if (!this.isSynced) {
      this.angle += this.speed;
    }
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    fill(this.col);
    noStroke();
    rectMode(CENTER);
    rect(this.radius, 0, 30, 30, 4); 
    
    if (this.isSynced) {
      drawingContext.shadowBlur = 20;
      drawingContext.shadowColor = this.col;
      stroke(255);
      strokeWeight(3);
      noFill();
      ellipse(0, 0, this.radius * 2);
    }
    pop();
  }

  checkSync() {
    let normalizedAngle = this.angle % TWO_PI;
    let target = 0; 
    // Tolerância aumentada de 0.35 para 0.45 para ser mais justo 
    let tolerance = 0.45; 
    
    return abs(normalizedAngle - target) < tolerance || 
           abs(normalizedAngle - (TWO_PI)) < tolerance;
  }
}