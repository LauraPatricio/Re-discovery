// quarto.js
let bgQuartoImg; // Usei um nome diferente para evitar conflitos

const OCULOS = {
    relX: 0.8,
    relY: 0.18,
    relW: 0.10,
    relH: 0.07,
};

function preloadQuarto() {
    bgQuartoImg = loadImage('imagens/quarto_1_.png');
}

// quarto.js

function drawQuartoScreen() {
    image(bgQuartoImg, 0, 0, width, height);

    let ox = width  * OCULOS.relX;
    let oy = height * OCULOS.relY;
    let ow = width  * OCULOS.relW;
    let oh = height * OCULOS.relH;

    let oculosHover = (
        mouseX > ox - ow / 2 && mouseX < ox + ow / 2 &&
        mouseY > oy - oh / 2 && mouseY < oy + oh / 2
    );

    if (oculosHover) cursor(HAND);

    push();
    rectMode(CENTER);

    // 1. REMOÇÃO DA SHADOW:
    // Removi as linhas que definiam drawingContext.shadowBlur e shadowColor

    // 2. DEFINIÇÃO DAS CORES (Verde: rgb(0, 255, 0))
    if (oculosHover) {
        // Com Hover: Linha verde e Fundo verde com 35% de opacidade (aprox. 89 em escala de 255)
        stroke(0, 255, 0);
        fill(0, 255, 0, 89);
    } else {
        // Sem Hover: Apenas linha verde, sem preenchimento
        stroke(0, 255, 0);
        noFill();
    }

    // Desenha o retângulo
    strokeWeight(2);
    rect(ox, oy, ow, oh, 6);

    pop();
}

function handleQuartoClick() {
    let ox = width  * OCULOS.relX;
    let oy = height * OCULOS.relY;
    let ow = width  * OCULOS.relW;
    let oh = height * OCULOS.relH;

    if (mouseX > ox - ow / 2 && mouseX < ox + ow / 2 &&
        mouseY > oy - oh / 2 && mouseY < oy + oh / 2) {
        goTo("LIVRO");
    }
}