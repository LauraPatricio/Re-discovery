//para imagens
let bgImg2; 
let buttonImages = {};
let words = ["WORK IT", "MAKE IT", "DO IT", "MAKES US", "HARDER", "BETTER", "FASTER", "STRONGER"];
let buttons2 = [];

let correctSequence = [];
let playerSequence2 = [];
let tarefa2State = "INSTRUCTIONS";
let sequenceIndex = 0;
let displayWord = "";
let loseTimer = 0;

//variaves pop-up tarefa2
let t2_popX, t2_popY, t2_popW, t2_popH;

let wordSounds = {}; 

function preloadTarefa2() {
    bgImg2 = loadImage('imagens/tarefa2.png');
    for (let word of words) {
        buttonImages[word] = loadImage('imagens/' + word + '.png');
        wordSounds[word] = loadSound('sons/' + word + '.mp3'); 
    }
}

//gerar a sequencia e preparar os btns 
function setupTarefa2() {
    generateRandomSequence(4);
    initializeButtonsTarefa2();
}

function initializeButtonsTarefa2() {
    buttons2 = [];

    //Calcular o tamanho do pop-up 
    t2_popW = width * 0.65;
    t2_popH = t2_popW * (500 / 800);

    if (t2_popH > height * 0.65) {
        t2_popH = height * 0.65;
        t2_popW = t2_popH * (800 / 500);
    }

    //Calcular o centro
    t2_popX = width / 2 - t2_popW / 2;
    t2_popY = height / 2 - t2_popH / 2;

    let startX = t2_popX + t2_popW * (130 / 800);
    let startY = t2_popY + t2_popH * (320 / 500);
    let colGap = t2_popW * (115 / 800);
    let rowGap = t2_popH * (65 / 500);

    let btnW = t2_popW * (100 / 800);
    let btnH = t2_popH * (50 / 500);

    for (let i = 0; i < words.length; i++) {
        let col = i % 5;
        let row = floor(i / 5);
        buttons2.push({
            word: words[i],
            x: startX + (col * colGap),
            y: startY + (row * rowGap),
            w: btnW,
            h: btnH
        });
    }
}

function drawTarefa2() {
    push();
    imageMode(CENTER);
    image(bgNave, width/2, height/2, naveNewW, naveNewH);
    pop();

    noStroke();
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);

    push();
    imageMode(CORNER);
    image(bgImg2, t2_popX, t2_popY, t2_popW, t2_popH); 
    pop();

    // logica estados/ instruções e jogo
    if (tarefa2State === "INSTRUCTIONS") {

    
        push();
        translate(t2_popX, t2_popY);
        scale(t2_popW / WIDE_WIDTH, t2_popH / WIDE_HEIGHT); 
        drawTaskInstructions(
            "Harder Better Faster Stronger", 
            "SYNC THE VOCALS. Watch the lyrics flash on the screen. Once the sequence ends, click the buttons in the exact same order to reconstruct the code."
        );
        pop();
    } 
    else {
       
        if (tarefa2State === 'MEMORIZE') {
            handleMemorizePhase();
        } else if (tarefa2State === 'PLAY') {
            drawNeonPhrase(playerSequence2, color(0, 255, 100));
        } else if (tarefa2State === 'WIN') {
            drawNeonPhrase(["MEMORY SYNCED"], color(0, 255, 100));
        } else if (tarefa2State === 'LOSE') {
            handleLoseState();
        }

        drawButtonsTarefa2(); // Só desenha os botões se o jogo já tiver começado
    }
}

function handleMemorizePhase() {
    let frameCycle = frameCount % 120;

    if (frameCycle === 0 && sequenceIndex < correctSequence.length) {
        displayWord = correctSequence[sequenceIndex];

        // Toca o som da palavra exibida
        if (wordSounds[displayWord]) wordSounds[displayWord].play(); 
        sequenceIndex++;
    } else if (frameCycle === 60) {
        displayWord = "";
    }

    if (sequenceIndex === correctSequence.length && frameCycle === 119) {
        tarefa2State = 'PLAY';
    }

    if (displayWord !== "") {
        drawNeonPhrase([displayWord], color(0, 255, 100));
    }
}

function handleLoseState() {
    drawNeonPhrase(["SYNC FAILED"], color(255, 50, 50));

    loseTimer++;
    if (loseTimer > 120) {
        loseTimer = 0;
        playerSequence2 = [];
        sequenceIndex = 0;
        displayWord = "";
        tarefa2State = 'MEMORIZE';
    }
}

function drawButtonsTarefa2() {
    for (let b of buttons2) {
        image(buttonImages[b.word], b.x, b.y, b.w, b.h);
    }
}

function drawNeonPhrase(sequence, col) {
    textAlign(CENTER, CENTER);

    // tamanho do texto ajustado ao pop-up
    textSize(t2_popW * (30 / 800));
    let phrase = sequence.join(" ");

    // Posição y do texto relativa ao pop-up
    let textY = t2_popY + t2_popH * (135 / 500);

    push();
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = col;

    fill(col);
    text(phrase, width / 2, textY);

    drawingContext.shadowBlur = 5;
    fill(255);
    text(phrase, width / 2, textY);
    pop();
}

function mousePressedTarefa2() {
    // Verificar o botão start no menu de instruções
    if (tarefa2State === "INSTRUCTIONS") {
        if (checkStartClick()) {
            tarefa2State = "MEMORIZE"; // Muda de estado para começar a piscar as palavras
        }
        return;

    //logica jogo
    if (tarefa2State !== 'PLAY') return;

    for (let b of buttons2) {
        if (mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h) {
            if (wordSounds[b.word]) wordSounds[b.word].play(); 
            checkInput(b.word);
            break;
        }
    }
}

function checkInput(clickedWord) {
    playerSequence2.push(clickedWord);

    if (playerSequence2.length === correctSequence.length) {
        let isCorrect = true;
        for (let i = 0; i < correctSequence.length; i++) {
            if (playerSequence2[i] !== correctSequence[i]) {
                isCorrect = false;
                break;
            }
        }

        if (isCorrect) {
            tarefa2State = 'WIN';

            //vitoria
            TarefaConcluida.harder = true;

            setTimeout(() => {
                //Reset automático para a próxima vez que jogar
                generateRandomSequence(4);
                playerSequence2 = [];
                sequenceIndex = 0;
                displayWord = "";
                
                tarefa2State = "INSTRUCTIONS";
                
                // chama a memoria
                concluirComMemoria("harder"); 
            }, 1500);

        } else {
            tarefa2State = 'LOSE';
            loseTimer = 0;
        }
    }
}

function generateRandomSequence(len) {
    correctSequence = [];
    for (let i = 0; i < len; i++) {
        correctSequence.push(random(words));
    }
}

// Para redimensionar a janela 
function windowResizedTarefa2() {
    initializeButtonsTarefa2();
}