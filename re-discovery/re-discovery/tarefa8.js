let bg, vinylCenterImg;
let phase = 1; 
let sliderY = 300;
let sliderSpeed = 4;
let sliderDirection = 1;

// --- COORDINATES TUNED TO THE CONSOLE BOX ---
let rectX = 104;     
let rectW = 128;     
let greenZoneY = 260; 
let greenZoneH = 80;

// ADJUSTED: Moved higher (285) and scaled up (145px) to cover the hole
let vinylX = 604;    
let vinylY = 250; 
// --------------------------------------------

let rotationAngle = 0;
let targetRotations = 5; 
let totalRotation = 0;
let lastMouseAngle = 0;
let isSpinning = false;

const GAME_WIDTH = 900;
const GAME_HEIGHT = 500;

function preload() {
  bg = loadImage('tarefa8.png');
  vinylCenterImg = loadImage('Daft_Punk_Discovery.png'); 
}

function setup() {
  createCanvas(GAME_WIDTH, GAME_HEIGHT);
}

function draw() {
  background(0);
  image(bg, 0, 0, GAME_WIDTH, GAME_HEIGHT);

  drawVinylLabel();

  if (phase === 1) {
    handleSliderPhase();
  } else if (phase === 2) {
    handleVinylPhase();
  } else if (phase === 3) {
    showFinalWin();
  }
}

function drawVinylLabel() {
  push();
  translate(vinylX, vinylY);
  rotate(rotationAngle);
  imageMode(CENTER);
  // SIZE INCREASED: 145px covers the white area better
  image(vinylCenterImg, 0, 0, 155, 155); 
  pop();
}

function handleSliderPhase() {
  fill(0, 255, 100, 180);
  noStroke();
  rect(rectX, greenZoneY, rectW, greenZoneH); 

  sliderY += sliderSpeed * sliderDirection;
  if (sliderY > 430 || sliderY < 140) sliderDirection *= -1;

  stroke(0, 255, 255);
  strokeWeight(5);
  line(rectX, sliderY, rectX + rectW, sliderY);
  
  drawingContext.shadowBlur = 15;
  drawingContext.shadowColor = color(0, 255, 255);
  line(rectX, sliderY, rectX + rectW, sliderY);
  drawingContext.shadowBlur = 0; 
}

function handleVinylPhase() {
  if (mouseIsPressed && dist(mouseX, mouseY, vinylX, vinylY) < 180) {
    let currentAngle = atan2(mouseY - vinylY, mouseX - vinylX);
    
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

  // --- PROGRESS BAR: SMALLER WIDTH ---
  let barWidth = 150; // Reduced from 300
  let progress = map(totalRotation, 0, TWO_PI * targetRotations, 0, barWidth);
  
  noStroke();
  fill(40);
  rect(width/2 - barWidth/2, 445, barWidth, 8, 4); 
  
  fill(0, 255, 100);
  rect(width/2 - barWidth/2, 445, constrain(progress, 0, barWidth), 8, 4);

  if (totalRotation >= TWO_PI * targetRotations) {
    phase = 3;
  }
}

function mousePressed() {
  if (phase === 1) {
    if (sliderY > greenZoneY && sliderY < greenZoneY + greenZoneH) {
      phase = 2;
    }
  }
}

function showFinalWin() {
  fill(0, 0, 0, 220);
  rect(0, 0, width, height);
  
  textAlign(CENTER, CENTER);
  drawingContext.shadowBlur = 25;
  drawingContext.shadowColor = color(0, 255, 100);
  
  fill(0, 255, 100);
  textSize(50);
  text("IDENTITY RECOVERED", width/2, height/2 - 20);
  
  drawingContext.shadowBlur = 0;
  fill(255);
  textSize(22);
  text("One More Time... Discovery complete.", width/2, height/2 + 50);
}