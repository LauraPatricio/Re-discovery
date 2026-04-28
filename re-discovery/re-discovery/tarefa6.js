let bgImg;
let rocketImg;
let isDragging = false;
let gameStatus = "START"; 
let pathPoints = [];

// The detection buffer for the coordination challenge 
const tolerance = 30; 

function preload() {
  bgImg = loadImage('tarefa6.png');
  rocketImg = loadImage('rocket.png');
}

function setup() {
  createCanvas(1024, 576); 
  
  // checkpoints do caminhos com tolerancia de 30
  pathPoints = [
    { x: 180, y: 300 }, 
    { x: 180, y: 250 }, 
    { x: 200, y: 215 },
    { x: 230, y: 170 },  
    { x: 270, y: 160 }, 
    { x: 300, y: 210 }, 
    { x: 300, y: 260 },
    { x: 300, y: 300 },
    { x: 290, y: 330 },   
    { x: 280, y: 370 }, 
    { x: 300, y: 420 }, 
    { x: 330, y: 430 }, 
    { x: 370, y: 400 }, 
    { x: 400, y: 370 }, 
    { x: 420, y: 340 }, 
    { x: 450, y: 300 }, 
    { x: 490, y: 260 }, 
    { x: 520, y: 230 }, 
    { x: 570, y: 210 }, 
    { x: 600, y: 230 }, 
    { x: 590, y: 270 }, 
    { x: 580, y: 300 }, 
    { x: 580, y: 340 }, 
    { x: 630, y: 330 }, 
    { x: 660, y: 300 }, 
    { x: 700, y: 280 },
    { x: 740, y: 280 }   
  ];
}

function draw() {
  background(0);
  imageMode(CORNER);
  image(bgImg, 0, 0, width, height);
  
 // drawDebugPath();

  if (gameStatus === "START") {
    drawOverlay("VOYAGER", "Hold the mouse to guide the rocket to the planet.");
    drawRocket(pathPoints[0].x, pathPoints[0].y);
  } 
  else if (gameStatus === "PLAYING") {
    updateGame();
  } 
  else if (gameStatus === "FAIL") {
    drawOverlay("STRAYED FROM PATH", "Click the start to try again!");
  } 
  else if (gameStatus === "WIN") {
    drawOverlay("MEMORY RECOVERED", "You've broken the transe!");
  }

  //fill(255);
  //noStroke();
  //textAlign(LEFT, BOTTOM);
  //textSize(14);
  //text(`Mouse X: ${floor(mouseX)}, Y: ${floor(mouseY)}`, 10, height - 10);
}

// funçao de debug pra ver os checkpoints 
function drawDebugPath() {
  for (let p of pathPoints) {
    noFill();
    stroke(255, 0, 0, 100); 
    circle(p.x, p.y, tolerance * 2);
    
    fill(255, 0, 0);
    noStroke();
    circle(p.x, p.y, 8);
  }
}

function updateGame() {
  if (isDragging) {
    let minD = 1000;
    //ver qual é o checkpoint mais perto do rato
    for (let p of pathPoints) {
      let d = dist(mouseX, mouseY, p.x, p.y);
      if (d < minD) minD = d;
    }

    if (minD > tolerance) {
      gameStatus = "FAIL";
      isDragging = false;
    }

    //qnd chega ao final
    let endPoint = pathPoints[pathPoints.length - 1];
    if (dist(mouseX, mouseY, endPoint.x, endPoint.y) < 10) {
      gameStatus = "WIN";
      isDragging = false;
    }

    drawRocket(mouseX, mouseY);
  }
}

function drawRocket(x, y) {
  imageMode(CENTER);
  image(rocketImg, x, y, 60, 60);
}

//efeitos visuais
function drawOverlay(title, subtitle) {
  fill(0, 0, 0, 180);
  rect(0, 0, width, height);
  
  textAlign(CENTER, CENTER);
  fill(0, 255, 255); 
  textSize(40);
  text(title, width / 2, height / 2 - 30);
  
  fill(255);
  textSize(20);
  text(subtitle, width / 2, height / 2 + 30);
}

function mousePressed() {
  if (gameStatus === "START" || gameStatus === "FAIL") {
    if (dist(mouseX, mouseY, pathPoints[0].x, pathPoints[0].y) < 100) {
      gameStatus = "PLAYING";
      isDragging = true;
    }
  } else if (gameStatus === "PLAYING") {
    isDragging = true;
  }
}

function mouseReleased() {
  if (gameStatus === "PLAYING") {
    isDragging = false;
  }
}