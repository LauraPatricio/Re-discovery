let bg;
let syllables = [];
let correctOrder = [2, 3, 0, 1]; 
let playerPath = [];
let currentWord = "";
let discoveryVisible = false;
let errorTimer = 0;
let flashError = false;

const GAME_WIDTH = 900;
const GAME_HEIGHT = 500;

// Central coordinates for the syllable ring (shifted left)
const RING_X = 280; 
const RING_Y = GAME_HEIGHT / 2;
const RING_RADIUS = 120;

function preload() {
  bg = loadImage('tarefa4.png'); // Ensure filename matches
}

function setup() {
  createCanvas(GAME_WIDTH, GAME_HEIGHT);
  
  // Define syllable positions in a circular diamond relative to RING_X, RING_Y
  // Adjusted slightly for visual balance
  syllables = [
    { text: "VE", x: RING_X, y: RING_Y - 90, hit: false },     // Top
    { text: "RI", x: RING_X + 90, y: RING_Y, hit: false },     // Right
    { text: "DIS", x: RING_X, y: RING_Y + 90, hit: false },    // Bottom
    { text: "QUO", x: RING_X - 80, y: RING_Y, hit: false }     // Left
  ];
}

function draw() {
  image(bg, 0, 0, GAME_WIDTH, GAME_HEIGHT);

  drawUIRing();
  drawSyllables();
  drawConnectionLine();
  drawResultArea();
}

function drawUIRing() {
  // Draws the cyan guide ring on the left console area
  fill(0, 0, 0, 125);
  stroke(0, 255, 255, 100);
  strokeWeight(4);
  ellipse(RING_X, RING_Y, RING_RADIUS * 2.5, RING_RADIUS * 2);
}

function drawSyllables() {
  textAlign(CENTER, CENTER);
  textSize(32);
  strokeWeight(2);
  
  for (let i = 0; i < syllables.length; i++) {
    let s = syllables[i];
    
    // Syllable text (Cyan default, Green on path)
    if (playerPath.includes(i)) {
      fill(0, 255, 100); 
      //stroke(255);
    } else {
      fill(0, 255, 255); 
      //stroke(0, 100, 100);
    }
    
    text(s.text, s.x, s.y);
  }
}

function drawConnectionLine() {
  if (mouseIsPressed && playerPath.length > 0) {
    stroke(0, 255, 100, 200);
    strokeWeight(4);
    noFill();
    beginShape();
    for (let index of playerPath) {
      vertex(syllables[index].x, syllables[index].y);
    }
    vertex(mouseX, mouseY);
    endShape();
  }
}

function drawResultArea() {
  textAlign(CENTER, CENTER); // Centered display on the right console
  let displayX = 660; // Position on the center-right console area
  
  // 1. Handling the "Disquoveri / ERROR" flash area
  if (flashError) {
    // Show ERROR (where disquoveri would be)
    fill(255, 50, 50);
    textSize(45);
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = color(255, 50, 50);
    text("ERROR", displayX, 230);
    
    errorTimer--;
    if (errorTimer <= 0) flashError = false;
    
  } else if (currentWord !== "") {
    // Show current word or successful Disquoveri
    fill(0, 255, 100);
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(0, 255, 100);
    textSize(40);
    text(currentWord, displayX, 230);
  }

  // 2. Handling the discovery reveal bellow
  if (discoveryVisible) {
    fill(255);
    drawingContext.shadowColor = color(255);
    textSize(50);
    text("DISCOVERY", displayX, 300);
  }
  
  drawingContext.shadowBlur = 0; // Reset glow for other drawings
}

function mousePressed() {
  if (!discoveryVisible) {
    resetAttempt();
    flashError = false; 
  }
}

function mouseDragged() {
  if (discoveryVisible) return;

  for (let i = 0; i < syllables.length; i++) {
    let d = dist(mouseX, mouseY, syllables[i].x, syllables[i].y);
    
    // Syllable hitbox check
    if (d < 40 && !playerPath.includes(i)) {
      playerPath.push(i);
      updateDisplayWord();
    }
  }
}

function mouseReleased() {
  if (discoveryVisible) return;

  if (playerPath.length === correctOrder.length) {
    let isCorrect = true;
    for (let i = 0; i < playerPath.length; i++) {
      if (playerPath[i] !== correctOrder[i]) {
        isCorrect = false;
        break;
      }
    }

    if (isCorrect) {
      currentWord = "disquoveri";
      discoveryVisible = true;
    } else {
      currentWord = ""; // Clear the bad phrase
      flashError = true;
      errorTimer = 70; // Show ERROR for slightly over 1 second
      playerPath = []; // Reset the path immediately
    }
  } else {
    // Released too early, clear everything
    resetAttempt();
  }
}

function updateDisplayWord() {
  let temp = "";
  for (let index of playerPath) {
    temp += syllables[index].text;
  }
  currentWord = temp.toLowerCase();
}

function resetAttempt() {
  playerPath = [];
  currentWord = "";
}