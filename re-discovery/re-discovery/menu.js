let bgMenu, exitImg, logo;
let gameState = "MENU";
let startBtn, aboutBtn;

// Apenas declaramos as variáveis aqui (as contas serão feitas mais tarde)
let scaleRatioMenu, scaleRatioQuarto, scaleRatioNave;
let naveNewW, naveNewH, menuNewW, menuNewH, quartoNewW, quartoNewH;

// Variáveis da transição (fade a preto)
let fadeAlpha = 0;
let isFading = false;
let nextState = "";

// Proporção popup
let widePopX, widePopY, widePopW, widePopH;
const WIDE_WIDTH = 800;
const WIDE_HEIGHT = 450;


// ── Preload ───────────────────────────────────
function preload() {
    bgMenu = loadImage('imagens/fundo.png');
    exitImg = loadImage('imagens/Exit.png');
    logo = loadImage('imagens/logo.png');
    preloadQuarto();
    preloadLivro();
    preloadMenuPerson();
    preloadNave();
    preloadTarefa1();
    preloadTarefa2();
    preloadTarefa3();
    preloadTarefa4();
    preloadTarefa5();
    preloadTarefa6();
    preloadTarefa8();
}

// ── Setup ─────────────────────────────────────
function setup() {
    createCanvas(windowWidth, windowHeight);
    
    // --- NOVO: Calculamos os fundos logo que o jogo arranca ---
    calcularTamanhosFundo(); 
    
    calcularPopUpWide();
    initButtons();
    setupTarefa1();
    setupTarefa2();
    setupTarefa3();
    setupTarefa4();
    setupTarefa5();
    setupTarefa6();
    setupTarefa7();
    setupTarefa8();
}

// --- NOVA FUNÇÃO: Faz os cálculos matemáticos apenas quando o p5.js está pronto ---
function calcularTamanhosFundo() {
    scaleRatioMenu = max(width / bgMenu.width, height / bgMenu.height);
    scaleRatioQuarto = max(width / bgQuartoImg.width, height / bgQuartoImg.height);
    scaleRatioNave = max(width / bgNave.width, height / bgNave.height);

    naveNewW = bgNave.width * scaleRatioNave;
    naveNewH = bgNave.height * scaleRatioNave;
    menuNewW = bgMenu.width * scaleRatioMenu;
    menuNewH = bgMenu.height * scaleRatioMenu;
    quartoNewW = bgQuartoImg.width * scaleRatioQuarto;
    quartoNewH = bgQuartoImg.height * scaleRatioQuarto;
}

// ─── BOTÃO EXIT UNIVERSAL ─────────────────────────────
function drawUniversalExit() {
    let px, py, pw;

    // Ajusta o botão com base na tarefa em que estamos
    if (gameState === "TAREFA1") { px = popX ; py = popY; pw = popW; }
    else if (gameState === "TAREFA2") { px = t2_popX; py = t2_popY; pw = t2_popW; }
    else { px = widePopX; py = widePopY; pw = widePopW; }

    let size = width * 0.025; // Tamanho responsivo do botão
    let ex = px + pw + 8;        // Posição X (Canto superior direito)
    let ey = py;             // Posição Y (Canto superior direito)

    push();
    // Efeito de passar o rato por cima (Hover)
    if (dist(mouseX, mouseY, ex, ey) < size / 2) {
        cursor(HAND);
        tint(255, 150, 150); // Fica ligeiramente vermelho
    }

    image(exitImg, ex, ey, size, size);
    pop();
}

function checkUniversalExit() {
    let px, py, pw;
    if (gameState === "TAREFA1") { px = popX; py = popY; pw = popW; }
    else if (gameState === "TAREFA2") { px = t2_popX; py = t2_popY; pw = t2_popW; }
    else { px = widePopX; py = widePopY; pw = widePopW; }

    let size = width * 0.03;
    let ex = px + pw;
    let ey = py;

    // Se o clique foi em cima da bola de Exit
    if (dist(mouseX, mouseY, ex, ey) < size / 2) {
        resetCurrentTask(); // Limpa o jogo antes de sair
        goTo("NAVE");       // Volta à nave
        return true;        // Confirma que o clique foi processado
    }
    return false;
}

function resetCurrentTask() {
    if (gameState === "TAREFA1") {
        gameStatus = "";
        gameStarted = false;
    } else if (gameState === "TAREFA2") {
        tarefa2State = 'MEMORIZE';
        loseTimer = 0;
        playerSequence = [];
        sequenceIndex = 0;
        displayWord = "";
    } else if (gameState === "TAREFA3") { resetGame3(); }
    else if (gameState === "TAREFA4") { resetGame4(); }
    else if (gameState === "TAREFA5") { resetGame5(); }
    else if (gameState === "TAREFA6") { resetGame6(); }
    else if (gameState === "TAREFA7") {
        resetAttempt();
        discoveryVisible = false;
        flashError = false;
    }
    else if (gameState === "TAREFA8") { resetTarefa8(); }
}

function calcularPopUpWide() {
    widePopW = width * 0.65;
    widePopH = widePopW * (WIDE_HEIGHT / WIDE_WIDTH);

    if (widePopH > height * 0.65) {
        widePopH = height * 0.65;
        widePopW = widePopH * (WIDE_WIDTH / WIDE_HEIGHT);
    }

    widePopX = (width - widePopW) / 2;
    widePopY = (height - widePopH) / 2;
}

//__ Reajustar tamanho ____________________________
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    
    // --- NOVO: Recalcula os fundos se o utilizador aumentar ou encolher a janela! ---
    calcularTamanhosFundo(); 
    
    calcularPopUpWide(); 
    initButtons();
    windowResizedTarefa1();
    windowResizedTarefa2();
}

// ── Botões responsivos ─────────────────────────
function initButtons() {
    startBtn = {
        x: width * 0.5, y: height * 0.6,
        baseW: width * 0.15, h: height * 0.08,
        w: width * 0.15, text: "START"
    };
    aboutBtn = {
        x: width * 0.5, y: height * 0.72,
        baseW: width * 0.12, h: height * 0.07,
        w: width * 0.12, text: "ABOUT"
    };
}

// ── Loop principal ────────────────────────────
function draw() {
    if (!isFading) cursor(ARROW);

    if (gameState === "MENU") {
        drawMenu();
    } else if (gameState === "QUARTO") {
        drawQuartoScreen(); 
    } else if (gameState === "LIVRO") {
        drawLivroScreen();
    } else if (gameState === "MENU_PERSONAGENS") {
        drawMenuPersonagens();
    } else if (gameState === "NAVE") {
        drawNave();
    } else if (gameState === "TAREFA1") {
        drawTarefa1();
    } else if (gameState === "TAREFA2") {
        drawTarefa2();
    } else if (gameState === "TAREFA3") {
        drawTarefa3();
    } else if (gameState === "TAREFA4") {
        drawTarefa4();
    } else if (gameState === "TAREFA5") {
        drawTarefa5();
    } else if (gameState === "TAREFA6") {
        drawTarefa6();
    } else if (gameState === "TAREFA7") {
        drawTarefa7();
    } else if (gameState === "TAREFA8") {
        drawTarefa8();
    } else if (gameState === "VITORIA") { 
        drawVitoriaScreen();
    }

    if (gameState.startsWith("TAREFA")) {
        drawUniversalExit();
    }

    handleTransition();
}

// ── Menu ──────────────────────────────────────
function drawMenu() {
    let sizelogo = windowWidth / 2600;

    // --- CORREÇÃO: menuNewHnewH alterado para menuNewH ---
    image(bgMenu, 0, 0, menuNewW, menuNewH);
    
    push();
    imageMode(CENTER);
    image(logo, width / 2, height * 0.4, logo.width * sizelogo, logo.height * sizelogo);
    pop();

    textAlign(CENTER, CENTER);
    textFont('Impact');
    fill(255);
    textSize(width * 0.06);

    updateButton(startBtn);
    updateButton(aboutBtn);

    drawButton(startBtn);
    drawButton(aboutBtn);
}

function updateButton(btn) {
    let hover =
        mouseX > btn.x - btn.w / 2 && mouseX < btn.x + btn.w / 2 &&
        mouseY > btn.y - btn.h / 2 && mouseY < btn.y + btn.h / 2;

    btn.w = lerp(btn.w, hover ? btn.baseW * 1.3 : btn.baseW, 0.1);
    if (hover) cursor(HAND);
}

function drawButton(btn) {
    push();
    rectMode(CENTER);
    noFill();
    stroke(255);
    strokeWeight(width * 0.003);
    rect(btn.x, btn.y, btn.w, btn.h, 10);

    noStroke();
    fill(255);
    textSize(btn.h * 0.5);
    text(btn.text, btn.x, btn.y);
    pop();
}

// ── Transição (fade a preto) ──────────────────
let transitionType = "FADE"; 
let noiseDuration = 45;      
let noiseCounter = 0;

function goTo(novoEstado) {
    gameState = novoEstado; 
}

function handleTransition() {
    if (isFading) {
        fadeAlpha += 5; 
        if (fadeAlpha >= 255) {
            gameState = nextState;
            isFading = false;
        }
    } else if (fadeAlpha > 0) {
        fadeAlpha -= 5; 
    }

    fill(0, fadeAlpha);
    rect(0, 0, width, height);
}

// ── Input ─────────────────────────────────────
function mousePressed() {
    if (isFading) return; 

    if (gameState.startsWith("TAREFA")) {
        if (checkUniversalExit()) return; 
    }
    
    if (gameState === "MENU") {
        if (
            mouseX > startBtn.x - startBtn.w / 2 && mouseX < startBtn.x + startBtn.w / 2 &&
            mouseY > startBtn.y - startBtn.h / 2 && mouseY < startBtn.y + startBtn.h / 2
        ) {
            let fs = fullscreen();
            fullscreen(!fs);
            nextState = "QUARTO";
            isFading = true;
        }
    }
    else if (gameState === "QUARTO") {
        handleQuartoClick(); 
    } else if (gameState === "LIVRO") {
        handleLivroClick();
    } else if (gameState === "MENU_PERSONAGENS") {
        handlePersonagensClick();
    } else if (gameState === "NAVE") {
        handleNaveClick(); 
    } else if (gameState === "TAREFA1") {
        mousePressedTarefa1();
    } else if (gameState === "TAREFA2") {
        mousePressedTarefa2();
    } else if (gameState === "TAREFA3") {
        mousePressedTarefa3();
    } else if (gameState === "TAREFA4") {
        mousePressedTarefa4();
    } else if (gameState === "TAREFA5") {
        mousePressedTarefa5();
    } else if (gameState === "TAREFA6") {
        mousePressedTarefa6();
    } else if (gameState === "TAREFA7") {
        mousePressedTarefa7();
    } else if (gameState === "TAREFA8") {
        mousePressedTarefa8();
    } else if (gameState === "VITORIA") { 
        handleVitoriaClick();
    }
}

function keyPressed() {
    if (gameState === "TAREFA3") {
        keyPressedTarefa3();
    }
    else if (gameState === "TAREFA4") {
        keyPressedTarefa4();
    }
    else if (gameState === "TAREFA5") {
        keyPressedTarefa5();
    }
}

function mouseReleased() {
    if (gameState === "TAREFA6") {
        mouseReleasedTarefa6();
    }
    else if (gameState === "TAREFA7") {
        mouseReleasedTarefa7();
    }
}

function mouseDragged() {
    if (gameState === "TAREFA7") {
        mouseDraggedTarefa7();
    }
}