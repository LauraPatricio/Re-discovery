let bgImg;
let notes = [];
let sequence = [];
let playerSequence = [];
let isShowing = false;
let tarefa1State = "INSTRUCTIONS";
let step = 0;
let lastStepTime = 0;

let interactiveButtons = [];
let visualSquares = [];
let gameStatus = "";

// variaveis pop-up
let popX, popY, popW, popH;

function preloadTarefa1() {
    bgImg = loadImage('imagens/tarefa1.png');
    for (let i = 1; i <= 9; i++) {
        notes.push(loadSound(`note${i}.mp3`));
    }
}

// Em vez de setup() com createCanvas, usamos setupTarefa1()
function setupTarefa1() {
    initializeGrids();
}

function initializeGrids() {
    interactiveButtons = [];
    visualSquares = [];

    // Manter proporção)
    popW = width * 0.65;
    popH = popW * (600 / 1100);

    if (popH > height * 0.65) {
        popH = height * 0.65;
        popW = popH * (1100 / 600);
    }

    // Calcular o centro para o Pop-up
    popX = width / 2 - popW / 2;
    popY = height / 2 - popH / 2;

    //Coordenadas relativas ao tamanho e posição do Pop-up
    let rightX = popX + popW * 0.575;
    let rightY = popY + popH * 0.175;
    let gapX = popW * 0.126;
    let gapY = popH * 0.234;
    let sqSize = popW * 0.105;

    let leftX = popX + popW * 0.075;
    let leftY = popY + popH * 0.170;

    for (let i = 0; i < 9; i++) {
        let col = i % 3;
        let row = Math.floor(i / 3);

        interactiveButtons[i] = {
            x: rightX + col * gapX,
            y: rightY + row * gapY,
            size: sqSize,
            active: false
        };

        visualSquares[i] = {
            x: leftX + col * gapX,
            y: leftY + row * gapY,
            size: sqSize,
            active: false
        };
    }
}

function drawTarefa1() {
    push();
    image(bgMenu, 0, 0, menuNewW, menuNewH);
    imageMode(CENTER);
    image(bgNave, width/2, height/2, naveNewW, naveNewH);
    pop();

    noStroke();
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);

    push();
    imageMode(CORNER);
    image(bgImg, popX, popY, popW, popH); 
    pop();

    // logica mudança de estados
    if (tarefa1State === "INSTRUCTIONS") {
        push();
        translate(popX, popY);
        scale(popW / WIDE_WIDTH, popH / WIDE_HEIGHT); 
        drawTaskInstructions(
            "Aerodynamic", 
            "MEMORIZE THE PATTERN. Watch the sequence of lights and sounds carefully, then repeat it perfectly."
        );
        pop();
    }
    else {
        

        // Lógica da sequência
        if (isShowing) {
            if (millis() - lastStepTime > 600) {

                // desativa todos os brilhos antes de mostrar o próximo
                for (let i = 0; i < 9; i++) visualSquares[i].active = false;

                if (step < sequence.length) {
                    let currentIdx = sequence[step];
                    visualSquares[currentIdx].active = true;
                    notes[currentIdx].play();
                    step++;
                    lastStepTime = millis();
                } else {
                    isShowing = false;
                    for (let i = 0; i < 9; i++) visualSquares[i].active = false;
                }
            }
        }

        // Desenha os elementos ativos do jogo
        drawVisualFeedbacks();
        drawResultMessage();
    }
}

function drawVisualFeedbacks() {

   for (let i = 0; i < 9; i++) {
        if (visualSquares[i].active) {
            noStroke();
            fill(255, 255, 255, 180);
            rect(visualSquares[i].x, visualSquares[i].y, visualSquares[i].size, visualSquares[i].size);
        }
    }

    for (let i = 0; i < 9; i++) {
        let b = interactiveButtons[i];
        
        // Deteta se o rato está por cima E a ser pressionado
        let isPressed = mouseIsPressed && mouseX > b.x && mouseX < b.x + b.size && mouseY > b.y && mouseY < b.y + b.size;

        if (b.active) {
            noStroke();
            fill(150, 150, 150, 150);
            rect(b.x, b.y, b.size, b.size);
        } 
    }

}

function drawResultMessage() {
    if (gameStatus !== "") {
        push();
        translate(popX, popY);
        scale(popW / WIDE_WIDTH, popH / WIDE_HEIGHT); 

        if (gameStatus === "FAIL") {
            showFailScreenUniform();
        } else if (gameStatus === "PASS") {
            showWinScreenUniform();
        }
        pop();
    }
}

function showWinScreenUniform() {
    fill(0, 0, 0, 200);
    rect(0, 0, WIDE_WIDTH, WIDE_HEIGHT);
    
    push();
    textAlign(CENTER, CENTER);
    textFont('Impact');
    
   
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(0, 255, 100);
    fill(0, 255, 100);
    textSize(WIDE_WIDTH * 0.08); 
    text("IDENTITY RECOVERED", WIDE_WIDTH / 2, WIDE_HEIGHT / 2);
    
    
    drawingContext.shadowBlur = 0; 
    textSize(WIDE_WIDTH * 0.03); 
    fill(255);
    text("MEMORY SYNCED...", WIDE_WIDTH / 2, WIDE_HEIGHT / 2 + 60);
    pop();
}

function showFailScreenUniform() {
    fill(0, 0, 0, 200);
    rect(0, 0, WIDE_WIDTH, WIDE_HEIGHT);
    
    push();
    textAlign(CENTER, CENTER);
    textFont('Impact');
    
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(255, 0, 0);
    fill(255, 0, 0);
    textSize(WIDE_WIDTH * 0.08);
    text("FAILED - TRY AGAIN", WIDE_WIDTH / 2, WIDE_HEIGHT / 2);
    pop();
}

function drawStartScreen() {
    fill(0, 0, 0, 200);
    rect(popX, popY, popW, popH);
    fill(255);
    textAlign(CENTER, CENTER);
    textFont('Impact');
    textSize(popW * 0.03); 
    text("AERODYNAMIC: MEMORIZE THE PATTERN\nCLICK TO START", width / 2, height / 2);
}

function mousePressedTarefa1() {
    if (tarefa1State === "INSTRUCTIONS") {
        if (checkStartClick()) {
            tarefa1State = "PLAY"; 
            startNewRound(); // Arranca a primeira sequência de luzes/sons
        }
        return; 
    }

    if (isShowing || gameStatus === "PASS") return;

    for (let i = 0; i < 9; i++) {
        let b = interactiveButtons[i];
        if (mouseX > b.x && mouseX < b.x + b.size && mouseY > b.y && mouseY < b.y + b.size) {
            handlePlayerInput(i);
        }
    }
}

function handlePlayerInput(idx) {
    interactiveButtons[idx].active = true;
    notes[idx].play();
    playerSequence.push(idx);

    let currentMove = playerSequence.length - 1;
    if (playerSequence[currentMove] !== sequence[currentMove]) {
        gameStatus = "FAIL";
        setTimeout(() => {
            gameStatus = "";
            startNewRound();
        }, 1500);
    } else if (playerSequence.length === sequence.length) {
        gameStatus = "PASS";
        TarefaConcluida.aerodynamic = true;
        setTimeout(() => {
            tarefa1State = "INSTRUCTIONS";
            concluirComMemoria("aerodynamic");
        }, 1500);
    }
    setTimeout(() => { interactiveButtons[idx].active = false; }, 200);
}

function startNewRound() {
    sequence = [];
    
    // Gera uma sequência 
    for (let i = 0; i < 5; i++) {
        let randomButton = floor(random(9)); 
        sequence.push(randomButton);
    }
    
    playerSequence = [];
    isShowing = true;
    step = 0;
    lastStepTime = millis();
    gameStatus = "";
}

//chamar quando redimensionar a janela
function windowResizedTarefa1() {
    initializeGrids();
}