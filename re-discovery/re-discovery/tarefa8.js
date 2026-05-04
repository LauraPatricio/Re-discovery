let bgImg8, vinylCenterImg;
let tarefa8phase = 1; 
let sliderY = 270; // (Era 300) Ajustado para a proporção 800x450
let sliderSpeed = 4;
let sliderDirection = 1;

// --- COORDENADAS AJUSTADAS PARA 800x450 ---
let rectX = 92;      // (Era 104)
let rectW = 114;     // (Era 128)
let greenZoneY = 234; // (Era 260)
let greenZoneH = 72;  // (Era 80)

let vinylX = 537;    // (Era 604)
let vinylY = 225;    // (Era 250)
// --------------------------------------------

let rotationAngle = 0;
let targetRotations = 5; 
let totalRotation = 0;
let lastMouseAngle = 0;
let isSpinning = false;

function preloadTarefa8() {
  // Ajustado o prefixo para carregar da pasta correta
  bgImg8 = loadImage('imagens/tarefa8.png');
  vinylCenterImg = loadImage('imagens/Daft_Punk_Discovery.png'); 
}

function setupTarefa8() {
}

function drawTarefa8() {
  // ── EFEITO POP-UP ──
  push();
  imageMode(CENTER);
  image(bgNave, width / 2, height / 2, naveNewW, naveNewH);
  pop();
  
  noStroke();
  fill(0, 0, 0, 180);
  rect(0, 0, width, height); 

  // ── ESCALA PARA O POP-UP WIDESCREEN ──
  push();
  translate(widePopX, widePopY);
  scale(widePopW / WIDE_WIDTH, widePopH / WIDE_HEIGHT);

  imageMode(CORNER);
  image(bgImg8, 0, 0, WIDE_WIDTH, WIDE_HEIGHT);

  drawVinylLabel();

  // Corrigido de "phase" para usar a tua variável global "tarefa8phase"
  if (tarefa8phase === 1) {
    handleSliderPhase();
  } else if (tarefa8phase === 2) {
    handleVinylPhase();
  } else if (tarefa8phase === 3) {
    showFinalWin();
  }
  
  pop(); // Fim da escala
}

function drawVinylLabel() {
  push();
  translate(vinylX, vinylY);
  rotate(rotationAngle);
  imageMode(CENTER);
  // Tamanho redimensionado proporcionalmente de 155 para 138
  image(vinylCenterImg, 0, 0, 138, 138); 
  pop();
}

function handleSliderPhase() {
  fill(0, 255, 100, 180);
  noStroke();
  rect(rectX, greenZoneY, rectW, greenZoneH); 

  sliderY += sliderSpeed * sliderDirection;
  
  // Limites do slider redimensionados proporcionalmente de 430/140 para 387/126
  if (sliderY > 387 || sliderY < 126) sliderDirection *= -1;

  stroke(0, 255, 255);
  strokeWeight(5);
  line(rectX, sliderY, rectX + rectW, sliderY);
  
  drawingContext.shadowBlur = 15;
  drawingContext.shadowColor = color(0, 255, 255);
  line(rectX, sliderY, rectX + rectW, sliderY);
  drawingContext.shadowBlur = 0; 
}

function handleVinylPhase() {
  // Conversão do rato virtual para o vinil detetar a rotação corretamente
  let virtualMouseX = (mouseX - widePopX) / (widePopW / WIDE_WIDTH);
  let virtualMouseY = (mouseY - widePopY) / (widePopH / WIDE_HEIGHT);

  if (mouseIsPressed && dist(virtualMouseX, virtualMouseY, vinylX, vinylY) < 160) {
    let currentAngle = atan2(virtualMouseY - vinylY, virtualMouseX - vinylX);
    
    if (isSpinning) {
      let delta = currentAngle - lastMouseAngle;
      if (delta > PI) delta -= TWO_PI;
      if (delta < -PI) delta += TWO_PI;
      rotationAngle += delta;
      totalRotation += abs(delta);
    }
    lastMouseAngle = currentAngle;
    isSpinning = true;
  } else {
    isSpinning = false;
  }

  // --- PROGRESS BAR: SMALLER WIDTH E CENTRALIZADA NO NOSSO WIDE_WIDTH ---
  let barWidth = 150; 
  let progress = map(totalRotation, 0, TWO_PI * targetRotations, 0, barWidth);
  
  noStroke();
  fill(40);
  rect(WIDE_WIDTH/2 - barWidth/2, 400, barWidth, 8, 4); 
  
  fill(0, 255, 100);
  rect(WIDE_WIDTH/2 - barWidth/2, 400, constrain(progress, 0, barWidth), 8, 4);

  if (totalRotation >= TWO_PI * targetRotations && tarefa8phase === 2) {
    tarefa8phase = 3;
    
    // --- VITÓRIA E DESBLOQUEIO ---
    TarefaConcluida.one = true; // Avisa a nave que a Tarefa One More Time foi feita
    
    setTimeout(() => {
        goTo("NAVE"); 
        resetTarefa8();
    }, 2000); // 2 segundos para o jogador ler o "Discovery Complete"
  }
}

function mousePressedTarefa8() {
  if (tarefa8phase === 1) {
    if (sliderY > greenZoneY && sliderY < greenZoneY + greenZoneH) {
      tarefa8phase = 2;
    }
  }
}

function showFinalWin() {
  fill(0, 0, 0, 220);
  rect(0, 0, WIDE_WIDTH, WIDE_HEIGHT);
  
  push();
  textAlign(CENTER, CENTER);
  textFont('Impact'); // Fonte uniforme
  
  // Efeito Neon Verde consistente com as outras tarefas[cite: 1, 8]
  drawingContext.shadowBlur = 25;
  drawingContext.shadowColor = color(0, 255, 100);
  
  fill(0, 255, 100);
  // Tamanho proporcional ao pop-up (usando a lógica da Tarefa 1: widePopW * 0.08)[cite: 1]
  textSize(WIDE_WIDTH * 0.08); 
  text("IDENTITY RECOVERED", WIDE_WIDTH / 2, WIDE_HEIGHT / 2 - 20);
  
  // Reset do brilho para o subtítulo
  drawingContext.shadowBlur = 0;
  fill(255);
  textSize(WIDE_WIDTH * 0.03); 
  text("ONE MORE TIME... DISCOVERY COMPLETE.", WIDE_WIDTH / 2, WIDE_HEIGHT / 2 + 60);
  pop();
}

function resetTarefa8() {
    tarefa8phase = 1;
    sliderY = 270;
    rotationAngle = 0;
    totalRotation = 0;
    isSpinning = false;
}