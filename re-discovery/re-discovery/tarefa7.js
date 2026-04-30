let syllables = [];
let correctOrder = [2, 3, 0, 1]; 
let playerPath = [];
let currentWord = "";
let discoveryVisible = false;
let errorTimer = 0;
let flashError = false;

// Utilizamos o nosso WIDE_HEIGHT global em vez de GAME_HEIGHT
const RING_X = 280; 
const RING_Y = 450 / 2; // (WIDE_HEIGHT / 2)
const RING_RADIUS = 120;

function preloadTarefa7() {
}

function setupTarefa7() {
  // Define as posições das sílabas usando a proporção panorâmica
  syllables = [
    { text: "VE", x: RING_X, y: RING_Y - 90, hit: false },     // Top
    { text: "RI", x: RING_X + 90, y: RING_Y, hit: false },     // Right
    { text: "DIS", x: RING_X, y: RING_Y + 90, hit: false },    // Bottom
    { text: "QUO", x: RING_X - 80, y: RING_Y, hit: false }     // Left
  ];
}

function drawTarefa7() {
  // ── EFEITO POP-UP ──
  image(bgNave, 0, 0, width, height); 
  
  noStroke();
  fill(0, 0, 0, 180);
  rect(0, 0, width, height); 

  // ── ESCALA PARA O POP-UP WIDESCREEN ──
  push();
  translate(widePopX, widePopY);
  scale(widePopW / WIDE_WIDTH, widePopH / WIDE_HEIGHT);

  // Corrigido de 'bg' para 'bgImg7'
  imageMode(CORNER);
  image(bgImg4, 0, 0, WIDE_WIDTH, WIDE_HEIGHT);

  drawUIRing();
  drawSyllables();
  drawConnectionLine();
  drawResultArea();
  
  pop(); // Fim da escala
}

function drawUIRing() {
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
    
    if (playerPath.includes(i)) {
      fill(0, 255, 100); 
    } else {
      fill(0, 255, 255); 
    }
    
    text(s.text, s.x, s.y);
  }
}

function drawConnectionLine() {
  if (mouseIsPressed && playerPath.length > 0) {
    // Calculamos o rato virtual para a linha desenhar no sítio certo!
    let virtualMouseX = (mouseX - widePopX) / (widePopW / WIDE_WIDTH);
    let virtualMouseY = (mouseY - widePopY) / (widePopH / WIDE_HEIGHT);

    stroke(0, 255, 100, 200);
    strokeWeight(4);
    noFill();
    beginShape();
    for (let index of playerPath) {
      vertex(syllables[index].x, syllables[index].y);
    }
    vertex(virtualMouseX, virtualMouseY); // Usa o rato virtual em vez do real
    endShape();
  }
}

function drawResultArea() {
  textAlign(CENTER, CENTER); 
  let displayX = 660; 
  
  if (flashError) {
    fill(255, 50, 50);
    textSize(45);
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = color(255, 50, 50);
    text("ERROR", displayX, 230);
    
    errorTimer--;
    if (errorTimer <= 0) flashError = false;
    
  } else if (currentWord !== "") {
    fill(0, 255, 100);
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(0, 255, 100);
    textSize(40);
    text(currentWord, displayX, 230);
  }

  if (discoveryVisible) {
    fill(255);
    drawingContext.shadowColor = color(255);
    textSize(50);
    text("DISCOVERY", displayX, 300);
  }
  
  drawingContext.shadowBlur = 0; 
}

function mousePressedTarefa7() {
  if (!discoveryVisible) {
    resetAttempt();
    flashError = false; 
  }
}

function mouseDraggedTarefa7() {
  if (discoveryVisible) return;

  // Calculamos o rato virtual para colidir com as sílabas em miniatura
  let virtualMouseX = (mouseX - widePopX) / (widePopW / WIDE_WIDTH);
  let virtualMouseY = (mouseY - widePopY) / (widePopH / WIDE_HEIGHT);

  for (let i = 0; i < syllables.length; i++) {
    let d = dist(virtualMouseX, virtualMouseY, syllables[i].x, syllables[i].y);
    
    if (d < 40 && !playerPath.includes(i)) {
      playerPath.push(i);
      updateDisplayWord();
    }
  }
}

function mouseReleasedTarefa7() {
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
      
      // --- VITÓRIA E DESBLOQUEIO ---
      TarefaConcluida.veridis = true; // Avisa a nave que a Stella fez a Veridis Quo
      
      setTimeout(() => {
          goTo("NAVE");
          resetAttempt(); // Limpa as variáveis para se o jogador quiser repetir
          discoveryVisible = false;
      }, 1500);

    } else {
      currentWord = ""; 
      flashError = true;
      errorTimer = 70; 
      playerPath = []; 
    }
  } else {
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