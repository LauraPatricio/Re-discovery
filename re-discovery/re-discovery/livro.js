// livro.js
let imgLivro;


const SETA = {
    relX: 0.71,
    relY: 0.79,
    relW: 0.06,
    relH: 0.08,
};

function preloadLivro() {
    imgLivro = loadImage('imagens/livro.png');
}

function drawLivroScreen() {
    background(0);
    image(bgMenu, 0, 0, width, height);

    noStroke();
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);

    push();
    imageMode(CENTER);
    image(imgLivro, width/2,height/2, imgLivro.width * 0.3, imgLivro.height * 0.3);
    pop();

    // ── Seta de próxima página ─────────────────
    drawSeta();
}

function drawSeta() {
    let sx = width  * SETA.relX;
    let sy = height * SETA.relY;
    let sw = width  * SETA.relW;
    let sh = height * SETA.relH;

    push();

    fill(0);
    noStroke();

    // Tamanho do triângulo baseado na hitbox definida em SETA
    let aw = sw * 0.4;
    let ah = sh * 0.4;

    // Desenha apenas o triângulo (Seta para a direita)
    triangle(
        sx - aw/2, sy - ah, // Ponto superior esquerdo
        sx - aw/2, sy + ah, // Ponto inferior esquerdo
        sx + aw/2, sy      // Ponta direita (centro vertical)
    );
    pop();
}

// Esta função deve ser chamada dentro do mousePressed() no seu menu.js
function handleLivroClick() {
    let sx = width  * SETA.relX;
    let sy = height * SETA.relY;
    let sw = width  * SETA.relW;
    let sh = height * SETA.relH;

    // Verifica se o clique foi dentro da área da seta
    if (
        mouseX > sx - sw / 2 && mouseX < sx + sw / 2 &&
        mouseY > sy - sh / 2 && mouseY < sy + sh / 2
    ) {
        goTo("MENU_PERSONAGENS");
    }
}