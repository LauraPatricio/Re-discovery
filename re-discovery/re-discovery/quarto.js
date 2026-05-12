// imagens
let bgQuartoImg;
let bgQuarto2Img;
let oculosImg, oculosHoverImg; 

// variáveis para guardar a posição e tamanho dos óculos
let ox = 0;
let oy = 0;
let ow = 0;
let oh = 0;

function preloadQuarto() {
    bgQuartoImg = loadImage('imagens/quarto_1_.png');
    bgQuarto2Img = loadImage('imagens/quarto_2.png'); // Carrega a imagem final
    oculosImg = loadImage('imagens/oculos.png');
    oculosHoverImg = loadImage('imagens/oculosHover.png');
}

function drawQuartoScreen() {
    // 1. Desenha o fundo do quarto (os tamanhos já vêm do menu.js)
    imageMode(CORNER);
    image(bgQuartoImg, 0, 0, quartoNewW, quartoNewH);

    // responsividade oculos 
    // ajustar a posição dos oculos
    let posX_Relativa = 0.78;
    let posY_Relativa = 0.17;

    // posição exata de x e y
    ox = quartoNewW * posX_Relativa;
    oy = quartoNewH * posY_Relativa;

    ow = quartoNewW * 0.15;
    let proporcao = oculosImg.height / oculosImg.width;
    oh = ow * proporcao; 

    //Hover Oculos
    // Caixa de colisão à volta dos óculos
    let isHover = mouseX > ox - ow / 2 && mouseX < ox + ow / 2 &&
        mouseY > oy - oh / 2 && mouseY < oy + oh / 2;

    push();
    imageMode(CENTER);
    let corNeon = color(62, 255, 81);

    if (isHover) {
        cursor(HAND);

        drawingContext.shadowBlur = 15;
        drawingContext.shadowColor = corNeon;

        image(oculosHoverImg, ox, oy, ow, oh);
    } else {
       drawingContext.shadowBlur = 15;
        drawingContext.shadowColor = corNeon;

        image(oculosImg, ox, oy, ow, oh);
    }
    pop();
}

function handleQuartoClick() {
    // verifica se o clique foi dentro da hitbox que calculámos no draw
    if (mouseX > ox - ow / 2 && mouseX < ox + ow / 2 &&
        mouseY > oy - oh / 2 && mouseY < oy + oh / 2) {

      
        goTo("LIVRO", "NOISE");
    }
}