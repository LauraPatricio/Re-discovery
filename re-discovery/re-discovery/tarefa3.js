let bgImg3; // Renomeado para evitar conflitos
let player3;
let obstacles3 = [];
let tarefa3State = 'PLAY';

// Dimensões virtuais do jogo (A física usa isto, não alteres)
let groundLevel3 = 342;
let gameSpeed3 = 5;

// Variáveis de pontuação
let score3 = 0;
const GOAL3 = 10;



function preloadTarefa3() {
    bgImg3 = loadImage('imagens/tarefa3.png');
}

function setupTarefa3() {
    player3 = new Player3();
}

function drawTarefa3() {
    // ── EFEITO POP-UP ──
    push();
    imageMode(CENTER);
    image(bgNave, width / 2, height / 2, naveNewW, naveNewH);
    pop();
    
    noStroke();
    fill(0, 0, 0, 180);
    rect(0, 0, width, height); // Película escura

    // ── O TRUQUE DE MESTRE DA ESCALA ──
    push();
    // Movemos o ponto de origem (0,0) para o canto do pop-up
    translate(widePopX, widePopY);
    // Encolhemos ou esticamos tudo o que desenhar para caber no popW / popH
    scale(widePopW / WIDE_WIDTH, widePopH / WIDE_HEIGHT);

    // A partir daqui, programamos como se o ecrã tivesse exatamente 800x500!
    imageMode(CORNER);
    image(bgImg3, 0, 0, WIDE_WIDTH, WIDE_HEIGHT);

    if (tarefa3State === 'PLAY') {
        player3.update();
        player3.show();

        displayScore3();

        if (obstacles3.length === 0 || (WIDE_WIDTH - obstacles3[obstacles3.length - 1].x) > random(250, 500)) {
            obstacles3.push(new Obstacle3());
        }

        for (let i = obstacles3.length - 1; i >= 0; i--) {
            obstacles3[i].move();
            obstacles3[i].show();

            // Verifica se o jogador saltou com sucesso
            if (!obstacles3[i].passed && obstacles3[i].x + obstacles3[i].w < player3.x) {
                score3++;
                obstacles3[i].passed = true;

                // --- CONDIÇÃO DE VITÓRIA ---
                if (score3 >= GOAL3) {
                    tarefa3State = 'WIN';

                    TarefaConcluida.crescendolls = true; // Avisa a nave (assumindo que a Tarefa 3 é a Crescendolls)se
                    setTimeout(() => {
                        goTo("NAVE");
                        resetGame3(); // Fica limpo para se o jogador quiser repetir depois
                    }, 1500);
                }
            }

            if (player3.hits(obstacles3[i])) {
                tarefa3State = 'GAMEOVER';
            }

            if (obstacles3[i].offscreen()) {
                obstacles3.splice(i, 1);
            }
        }
    } else if (tarefa3State === 'GAMEOVER') {
        showFailScreenUniform();
    } else if (tarefa3State === 'WIN') {
        showWinScreenUniform();
    }

    pop(); // Terminamos o truque da escala aqui!
}

function displayScore3() {
    textFont('Impact');
    fill(0, 255, 255);
    textAlign(LEFT);
    textSize(24);
    text(`MEMORIES RECOVERED: ${score3} / ${GOAL3}`, 60, 60);
}

function showFailScreenUniform() {
    push();
    textAlign(CENTER, CENTER);
    textFont('Impact');
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(255, 0, 0);
    
    fill(255, 0, 0);
    textSize(popW * 0.08);
    text("FAILED - TRY AGAIN", WIDE_WIDTH / 2, WIDE_HEIGHT / 2);
    pop();
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
    textSize(popW * 0.08); // Tamanho consistente com a Tarefa 1
    text("IDENTITY RECOVERED", WIDE_WIDTH / 2, WIDE_HEIGHT / 2);
    
    noAlpha(); // Reset shadow
    textSize(popW * 0.03);
    fill(255);
    text("MEMORY SYNCED...", WIDE_WIDTH / 2, WIDE_HEIGHT / 2 + 60);
    pop();
}


// Em vez da genérica keyPressed, criamos uma específica
function keyPressedTarefa3() {
    if (key === ' ' || keyCode === UP_ARROW) {
        if (tarefa3State === 'PLAY') {
            player3.jump();
        } else if (tarefa3State === 'GAMEOVER') {
            resetGame3();
        }
    }
}

function resetGame3() {
    obstacles3 = [];
    score3 = 0;
    tarefa3State = 'PLAY';
    player3 = new Player3();
}

// Renomeámos as classes para não chocar com futuras tarefas que possam usar a palavra "Player"
class Player3 {
    constructor() {
        this.size = 35;
        this.x = WIDE_WIDTH / 2 - this.size / 2;
        this.y = groundLevel3 - this.size;
        this.vy = 0;
        this.gravity = 0.8;
    }

    jump() {
        if (this.y === groundLevel3 - this.size) {
            this.vy = -14;
        }
    }

    update() {
        this.y += this.vy;
        this.vy += this.gravity;
        this.y = constrain(this.y, 0, groundLevel3 - this.size);
    }

    show() {
        fill(0, 255, 255);
        stroke(255);
        strokeWeight(2);
        rect(this.x, this.y, this.size, this.size);
    }

    hits(obs) {
        return (this.x < obs.x + obs.w &&
            this.x + this.size > obs.x &&
            this.y < obs.y + obs.h &&
            this.y + this.size > obs.y);
    }
}

class Obstacle3 {
    constructor() {
        this.type = floor(random(0, 3));
        this.speed = gameSpeed3;
        this.passed = false;

        if (this.type === 0) {
            this.w = 30;
            this.h = 40;
        } else if (this.type === 1) {
            this.w = 30;
            this.h = 75;
        } else {
            this.w = 80;
            this.h = 30;
        }

        this.x = WIDE_WIDTH;
        this.y = groundLevel3 - this.h;
    }

    move() {
        this.x -= this.speed;
    }

    show() {
        if (this.x > 50 && this.x < WIDE_WIDTH - 50) {
            fill(255, 50, 50);
            noStroke();
            if (this.type === 0) {
                triangle(this.x, this.y + this.h, this.x + this.w / 2, this.y, this.x + this.w, this.y + this.h);
            } else {
                rect(this.x, this.y, this.w, this.h);
            }
        }
    }

    offscreen() {
        return this.x < -this.w;
    }
}